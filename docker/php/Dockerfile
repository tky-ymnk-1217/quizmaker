FROM php:7.4-fpm

# Set working directory
WORKDIR /var/www/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u 1000 -d /home/quizmaker quizmaker
RUN mkdir -p /home/quizmaker/.composer && \
    chown -R quizmaker:quizmaker /home/quizmaker

# Set user
USER quizmaker

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
