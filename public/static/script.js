document.getElementById("checkButton").addEventListener("click", function() {
    // Smooth scroll to the Bot section
    document.getElementById("uploud-img").scrollIntoView({ behavior: "smooth" });
});

//fundus imge section
function showInfo(iconId) {
    let infoText = document.querySelector(`#${iconId} .hover-info`).innerText;
    let modal = document.getElementById("info-modal");

    document.getElementById("info-text").innerText = infoText;

    // Показываем модальное окно с анимацией
    modal.style.display = "block";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

function hideInfo() {
    let modal = document.getElementById("info-modal");

    // Плавно скрываем окно
    modal.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
    }, 400);
}


//Slider section
let currentIndex = 0;
const slider = document.querySelector(".slider");
const dotsContainer = document.querySelector(".dots");
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let slidesPerView = 3;
let totalSlides = document.querySelectorAll(".card").length;

// Инициализация точек
function initDots() {
    dotsContainer.innerHTML = '';
    const dotsCount = totalSlides - slidesPerView + 1;

    for(let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => setSlide(i);
        dotsContainer.appendChild(dot);
    }
}

// Обновление слайдера
function updateSlider() {
    const cardWidth = document.querySelector(".card").offsetWidth;
    const offset = currentIndex * (cardWidth + 30); // 30px gap
    const maxIndex = totalSlides - slidesPerView;

    slider.style.transform = `translateX(-${offset}px)`;

    // Управление видимостью кнопок
    prevBtn.classList.toggle('hidden', currentIndex === 0);
    nextBtn.classList.toggle('hidden', currentIndex >= maxIndex);

    // Обновление точек
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Переключение слайдов
function moveSlide(direction) {
    const newIndex = currentIndex + direction;
    const maxIndex = totalSlides - slidesPerView;

    if(newIndex >= 0 && newIndex <= maxIndex) {
        currentIndex = newIndex;
        updateSlider();
    }
}

// Прямой переход
function setSlide(index) {
    const maxIndex = totalSlides - slidesPerView;

    if(index >= 0 && index <= maxIndex) {
        currentIndex = index;
        updateSlider();
    }
}

// Адаптивность
function handleResize() {
    const oldSlidesPerView = slidesPerView;

    slidesPerView = window.innerWidth < 768 ? 1 :
                   window.innerWidth < 1024 ? 2 : 3;

    // Пересчет только при изменении количества слайдов
    if(oldSlidesPerView !== slidesPerView) {
        totalSlides = document.querySelectorAll(".card").length;
        initDots();
        setSlide(Math.min(currentIndex, totalSlides - slidesPerView));
    }

    updateSlider();
}

// Инициализация
window.addEventListener('resize', handleResize);
prevBtn.addEventListener('click', () => moveSlide(-1));
nextBtn.addEventListener('click', () => moveSlide(1));

// Первоначальная настройка
handleResize();
initDots();
updateSlider();

// Корректировка после загрузки изображений
window.addEventListener('load', () => {
    updateSlider();
    setTimeout(updateSlider, 300); // Дополнительная проверка
});


document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("Nuq08PLLgkMp-h4zv"); // Замените на ваш Public Key

    async function isUserLoggedIn() {
        try {
            const response = await fetch('https://chatbot-kz-ce86dc191511.herokuapp.com/api/auth/check-auth', {
                credentials: 'include'
            });
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }

    // Функция для обновления навигационного меню
    async function updateNavigationMenu() {
        const nav = document.querySelector('nav ul');
        if (!nav) return;

        const isLoggedIn = await isUserLoggedIn();

        // Находим существующие кнопки login/dashboard/logout
        const existingLogin = nav.querySelector('.login');
        const existingDashboard = nav.querySelector('.dashboard');
        const existingLogout = nav.querySelector('.logout');

        if (isLoggedIn) {
            // Если пользователь авторизован
            if (existingLogin) existingLogin.remove();

            // Добавляем кнопки dashboard и logout, если их нет
            if (!existingDashboard) {
                const dashboardLi = document.createElement('li');
                dashboardLi.innerHTML = '<a href="/dashboard" class="dashboard">Dashboard</a>';
                nav.appendChild(dashboardLi);
            }

            if (!existingLogout) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = '<a href="#" class="logout">Logout</a>';
                nav.appendChild(logoutLi);

                // Добавляем обработчик для кнопки logout
                const logoutButton = logoutLi.querySelector('.logout');
                logoutButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const response = await fetch('https://chatbot-kz-ce86dc191511.herokuapp.com/api/auth/logout', {
                            method: 'POST',
                            credentials: 'include'
                        });
                        if (response.ok) {
                            window.location.reload(); // Обновляет страницу
                            setTimeout(() => {
                                window.location.href = '/'; // Через небольшую задержку перенаправляет на "/"
                            }, 100);
                        }

                    } catch (error) {
                        console.error('Error logging out:', error);
                    }
                });

                logoutLi.appendChild(logoutButton);
                nav.appendChild(logoutLi);
            }
        } else {
            // Если пользователь не авторизован
            if (existingDashboard) existingDashboard.remove();
            if (existingLogout) existingLogout.remove();

            // Добавляем кнопку login, если её нет
            if (!existingLogin) {
                const loginLi = document.createElement('li');
                loginLi.innerHTML = '<a href="/login" class="login">Login</a>';
                nav.appendChild(loginLi);
            }
        }
    }

    // Обновляем меню при загрузке страницы
    updateNavigationMenu();

    // ✅ Перехват клика по кнопке отправки фото
    const sendPhotoButton = document.getElementById("sendButton");
    if (sendPhotoButton) {
        sendPhotoButton.addEventListener("click", async function (event) {
            if (!(await isUserLoggedIn())) {
                event.preventDefault();
                window.location.href = "/login";
            } else {
                sendPhoto();
            }
        });
    }



    // ✅ Обработчик отправки формы email
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let message = document.getElementById("message").value;

        if (name === "" || email === "" || message === "") {
            showNotification("❌ Please fill all fields!", "red");
            return;
        }

        let templateParams = {
            from_name: name,
            from_email: email,
            message: message,
        };

        emailjs.send("chatboteye", "template_78e0ygf", templateParams)
            .then(function () {
                showNotification("✅ Message Sent Successfully!", "green");
                document.getElementById("contact-form").reset();
            }, function (error) {
                showNotification("❌ Error Sending Message.", "red");
                console.error("Error:", error);
            });
    });

    function showNotification(message, color) {
        let notification = document.createElement("div");
        notification.classList.add("notification");
        notification.style.background = color;
        notification.textContent = message;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add("show"), 100);
        setTimeout(() => {
            notification.classList.add("hide");
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    // ✅ Файл-инпут с проверкой логина
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener("click", async function (event) {
            if (!(await isUserLoggedIn())) {
                event.preventDefault();
                window.location.href = "/login";
            }
        });

        fileInput.addEventListener("change", function () {
            if (fileInput.files.length === 0) {
                alert("Select an image!");
                return;
            }

            const file = fileInput.files[0];
            
        });
    }

    // Обработчик отправки сообщения
    const sendMessageButton = document.getElementById("sendMessage");
    if (sendMessageButton) {
        sendMessageButton.addEventListener("click", async function (event) {
            if (!(await isUserLoggedIn())) {
                event.preventDefault();
                window.location.href = "/login";
            } else {
                sendMessage();
            }
        });
    }
});

// ✅ Функция отправки фото в чат
async function sendPhoto() {
    const fileInput = document.getElementById("fileInput");
    const chatBox = document.getElementById("chat-box");

    if (fileInput.files.length === 0) {
        alert("Select an image!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const userMessage = document.createElement("div");
    userMessage.className = "user-message message";
    userMessage.innerHTML = `<img src="${URL.createObjectURL(file)}" style="max-width: 150px; border-radius: 10px;">`;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Temporarily disable predict functionality
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message message";
    botMessage.textContent = "Image analysis feature is temporarily unavailable. ";
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // try {
    //     const response = await fetch("http://localhost:8000/predict/", {
    //         method: "POST",
    //         body: formData
    //     });

    //     if (!response.ok) throw new Error("Server error!");

    //     const data = await response.json();

    //     let riskIcon = "";
    //     switch (data.risk_level) {
    //         case "Normal":
    //             riskIcon = "❇️";
    //             break;
    //         case "High Risk":
    //             riskIcon = "🔴";
    //             break;
    //         case "Moderate Risk":
    //             riskIcon = "🟠";
    //             break;
    //         case "Low Risk":
    //             riskIcon = "🟢";
    //             break;
    //         default:
    //             riskIcon = "⚠️";
    //     }

    //     const botMessageContent = document.createElement("div");
    //     botMessageContent.className = "bot-message message";
    //     botMessageContent.innerHTML = `
    //         <strong>📋 Diagnostic Report</strong> <br>
    //         <strong>🩺 Condition Name:</strong> ${data.detected} <br>
    //         <strong>📊 Probability:</strong> ${data.confidence}% <br>
    //         <strong>${riskIcon} Risk Level:</strong> ${data.risk_level} <br> <br>
    //         <pre style="white-space: pre-wrap; word-wrap: break-word;">${data.recommendation}</pre>
    //     `;
    //     chatBox.appendChild(botMessageContent);
    //     chatBox.scrollTop = chatBox.scrollHeight;
    // } catch (error) {
    //     const errorMessage = document.createElement("div");
    //     errorMessage.className = "bot-message message";
    //     errorMessage.textContent = "Error in analyzing the image 😔";
    //     chatBox.appendChild(errorMessage);
    // }
}

function clearChat() {
    document.getElementById("chat-box").innerHTML = '<div class="bot-message message">Upload a photo to be analyzed 👁️</div>';
}

document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.getElementById("burger-menu");
    const navMenu = document.getElementById("nav-menu");

    burgerMenu.addEventListener("click", function () {
        navMenu.classList.toggle("active");
    });
});

document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items first
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle clicked item if not active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Add initial animation to FAQ items
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item, index) => {
    item.style.animation = `fadeIn 0.5s ease forwards ${index * 0.2}s`;
    item.style.opacity = 0;
});
