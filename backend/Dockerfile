# backend/Dockerfile

FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    linux-headers \
    zip \
    unzip \
    git

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        gd \
        bcmath \
        opcache \
        exif \
        pcntl \
        sockets

# Clear cache
RUN rm -rf /var/cache/apk/*

WORKDIR /var/www/html

# Copy the backend application before Composer runs because Laravel's
# Composer scripts call artisan during install.
COPY backend/ .

# Install composer dependencies
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --no-interaction --no-progress --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage \
    && chmod -R 755 bootstrap/cache

# Copy Nginx and Supervisor configs
COPY backend/docker/nginx.conf /etc/nginx/http.d/default.conf
COPY backend/docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
