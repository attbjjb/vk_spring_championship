// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== МОДАЛЬНОЕ ОКНО ==========
    const modal = document.getElementById('registerModal');
    const registerBtn = document.getElementById('registerBtn');
    const closeModal = document.getElementById('closeModal');
    const modalSubscribeBtn = document.getElementById('modalSubscribeBtn');
    const modalOverlay = document.querySelector('.modal__overlay');
    
    // Открыть модальное окно
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // запрещаем скролл
        });
    }
    
    // Функция закрытия модального окна
    function closeModalWindow() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // возвращаем скролл
    }
    
    // Закрыть по крестику
    if (closeModal) {
        closeModal.addEventListener('click', closeModalWindow);
    }
    
    // Закрыть по оверлею
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModalWindow);
    }
    
    // Закрыть по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalWindow();
        }
    });
    
    // Кнопка "Подписаться" в модалке
    if (modalSubscribeBtn) {
        modalSubscribeBtn.addEventListener('click', function() {
            closeModalWindow();
            // Плавно скроллим к форме подписки
            const subscribeSection = document.querySelector('.subscribe');
            if (subscribeSection) {
                subscribeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ========== ОБРАБОТКА ФОРМЫ ПОДПИСКИ ==========
    const subscribeForm = document.getElementById('subscribeForm');
    const subscribeEmail = document.getElementById('subscribeEmail');
    const subscribeMessage = document.getElementById('subscribeMessage');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = subscribeEmail.value.trim();
            
            // Валидация email
            if (!isValidEmail(email)) {
                showMessage('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Здесь можно отправить данные на сервер
            // Для демонстрации просто показываем успех
            
            // Показываем индикатор загрузки
            const submitBtn = subscribeForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Имитация отправки на сервер
            setTimeout(() => {
                // Сохраняем в localStorage для демонстрации
                saveSubscription(email);
                
                showMessage('Спасибо за подписку! Гайд уже отправлен на вашу почту', 'success');
                subscribeEmail.value = '';
                
                // Возвращаем кнопку в исходное состояние
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Показываем уведомление
                showNotification('Вы успешно подписались на рассылку!');
                
            }, 1000);
        });
    }
    
    // Функция валидации email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Функция показа сообщения
    function showMessage(text, type) {
        subscribeMessage.textContent = text;
        subscribeMessage.className = 'subscribe__message ' + type;
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            subscribeMessage.textContent = '';
            subscribeMessage.className = 'subscribe__message';
        }, 5000);
    }
    
    
    // ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ==========
    const animatedElements = document.querySelectorAll('.card, .prize-card, .feature');
    
    // Функция проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top <= windowHeight - 100 && // элемент появился достаточно
            rect.bottom >= 0
        );
    }
    
    // Функция обработки скролла
    function handleScrollAnimation() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    // Запускаем сразу для видимых элементов
    handleScrollAnimation();
    
    // Вешаем обработчик на скролл с throttle для оптимизации
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                handleScrollAnimation();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
    
    // ========== СИСТЕМА УВЕДОМЛЕНИЙ ==========
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification__message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Стили для уведомлений
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--white);
                border-radius: var(--border-radius);
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                padding: 16px 24px;
                z-index: 3000;
                animation: slideIn 0.3s ease;
                border-left: 4px solid;
            }
            
            .notification--success {
                border-left-color: #28a745;
            }
            
            .notification--error {
                border-left-color: #dc3545;
            }
            
            .notification__content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification__icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                font-size: 14px;
            }
            
            .notification--success .notification__icon {
                background: #28a745;
                color: white;
            }
            
            .notification--error .notification__icon {
                background: #dc3545;
                color: white;
            }
            
            .notification__message {
                color: var(--text-dark);
                font-size: 14px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        const notificationStyleSheet = document.createElement('style');
        notificationStyleSheet.textContent = notificationStyles;
        document.head.appendChild(notificationStyleSheet);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // ========== ОБРАБОТКА КЛИКОВ ПО ССЫЛКАМ ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========== АНИМАЦИЯ КНОПОК ==========
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
    
    // ========== ДОБАВЛЯЕМ ИНДИКАТОР ПРОГРЕССА ПРИ СКРОЛЛЕ ==========
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    const progressStyles = `
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--vk-blue), #00a3ff);
            z-index: 1001;
            transition: width 0.1s ease;
        }
    `;
    
    const progressStyleSheet = document.createElement('style');
    progressStyleSheet.textContent = progressStyles;
    document.head.appendChild(progressStyleSheet);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    
    console.log('VK Spring Challenge сайт успешно загружен!');
}); // Конец DOMContentLoaded