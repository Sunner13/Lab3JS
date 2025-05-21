document.addEventListener('DOMContentLoaded', () => {
    const newsTitlesList = document.getElementById('news-titles-list');
    const newsContentArea = document.getElementById('news-content-area');

    const newsData = [
        {
            id: 1,
            title: "Нове надходження: Запчастини для двигунів серії EcoBoost",
            content: "<p>Шановні клієнти! Раді повідомити про значне розширення асортименту запчастин для популярних двигунів Ford EcoBoost. Тепер у нас доступні турбокомпресори, форсунки, комплекти ГРМ та багато іншого.</p><p>Всі деталі пройшли сертифікацію та мають гарантію від виробника. Запрошуємо ознайомитись з новинками у відповідному розділі каталогу.</p>",
            date: "2023-11-15",
            time: "10:30",
            important: true
        },
        {
            id: 2,
            title: "Акція: Знижка 15% на всі гальмівні системи до кінця місяця!",
            content: "<p>Не пропустіть вигідну пропозицію! Тільки до кінця листопада діє спеціальна знижка 15% на всі компоненти гальмівних систем: колодки, диски, супорти та рідини.</p><p>Подбайте про безпеку свого автомобіля за вигідною ціною. Акція діє при замовленні через сайт та у наших офлайн-магазинах.</p>",
            date: "2023-11-10",
            time: "14:00",
            important: false
        },
        {
            id: 3,
            title: "Технічне обслуговування сайту 20.11.2023",
            content: "<p>Увага! 20 листопада з 02:00 до 04:00 ночі будуть проводитись планові технічні роботи на сайті. У цей період можливі тимчасові перебої у доступі до сервісу.</p><p>Приносимо вибачення за можливі незручності.</p>",
            date: "2023-11-18",
            time: "09:00",
            important: false
        },
         {
            id: 4,
            title: "Розширення асортименту фільтрів MANN-FILTER",
            content: "<p>Відмінна новина для власників європейських автомобілів! Ми значно розширили асортимент фільтрів від провідного виробника MANN-FILTER.</p><p>Тепер у наявності ще більше масляних, повітряних, паливних та салонних фільтрів для найпопулярніших моделей. Забезпечте своєму авто найкращий захист!</p>",
            date: "2023-10-25",
            time: "11:15",
            important: true
        }
    ];

    function formatNewsDate(dateString, timeString) {
        const date = new Date(`${dateString}T${timeString}`);
        return `${date.toLocaleDateString('uk-UA')} ${timeString}`;
    }

    function renderNewsList() {
        if (!newsTitlesList) return;
        newsTitlesList.innerHTML = '';

        const sortedNews = [...newsData].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB - dateA;
        });

        sortedNews.forEach(news => {
            const listItem = document.createElement('li');
            listItem.dataset.newsId = news.id;
            
            const titleSpan = document.createElement('span');
            titleSpan.classList.add('news-title-text');
            titleSpan.textContent = news.title;
            if (news.important) {
                titleSpan.classList.add('important');
            }

            const dateSpan = document.createElement('span');
            dateSpan.classList.add('news-date');
            dateSpan.textContent = formatNewsDate(news.date, news.time);

            listItem.appendChild(titleSpan);
            listItem.appendChild(dateSpan);
            newsTitlesList.appendChild(listItem);

            listItem.addEventListener('click', () => displayNewsContent(news.id));
        });
    }

    function displayNewsContent(newsId) {
        if (!newsContentArea) return;
        const newsItem = newsData.find(n => n.id === newsId);
        if (!newsItem) {
            newsContentArea.innerHTML = '<p class="news-placeholder">Новину не знайдено.</p>';
            return;
        }

        newsContentArea.innerHTML = `
            <article class="news-article">
                <h3>${newsItem.title}</h3>
                <div class="article-meta">Опубліковано: ${formatNewsDate(newsItem.date, newsItem.time)}</div>
                ${newsItem.content}
            </article>
        `;
        
        if (window.innerWidth <= 768) {
            newsContentArea.scrollIntoView({ behavior: 'smooth' });
        }
    }

    renderNewsList();
});