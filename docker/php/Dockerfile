FROM php:8.4.13-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    pkg-config \
    g++ \
    make \
    autoconf \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_pgsql pgsql

RUN sed -i 's|listen = 9000|listen = 0.0.0.0:9000|' /usr/local/etc/php-fpm.d/zz-docker.conf

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

COPY backend/composer.json backend/composer.lock ./

RUN composer install --no-scripts --no-interaction --prefer-dist

COPY backend ./

CMD ["php-fpm"]
