<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::query()
            ->with(['customer', 'user'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['customer', 'user', 'items.product']);

        return response()->json($order);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'status' => ['sometimes', 'string', 'max:64'],
        ]);

        $userId = (int) $request->user()->id;

        /** @var Order $order */
        $order = DB::transaction(function () use ($data, $userId) {
            $lines = [];
            $total = '0';

            foreach ($data['items'] as $row) {
                /** @var Product $product */
                $product = Product::query()->lockForUpdate()->findOrFail($row['product_id']);
                $qty = (int) $row['quantity'];

                if ($product->stock < $qty) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for product \"{$product->name}\" (ID {$product->id})."],
                    ]);
                }

                $price = (string) $product->price;
                $line = bcmul($price, (string) $qty, 2);
                $total = bcadd($total, $line, 2);

                $lines[] = [
                    'product' => $product,
                    'quantity' => $qty,
                    'price' => $product->price,
                ];
            }

            $order = Order::query()->create([
                'customer_id' => $data['customer_id'],
                'user_id' => $userId,
                'total_amount' => $total,
                'status' => $data['status'] ?? 'completed',
            ]);

            foreach ($lines as $line) {
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $line['product']->id,
                    'quantity' => $line['quantity'],
                    'price' => $line['price'],
                ]);

                $line['product']->decrement('stock', $line['quantity']);
            }

            return $order->fresh();
        });

        $order->load(['customer', 'user', 'items.product']);

        return response()->json($order, 201);
    }
}
