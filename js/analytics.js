document.addEventListener('DOMContentLoaded', () => {
    const chartTypeSelect = document.getElementById('chart-type-select');
    const updateChartDataBtn = document.getElementById('update-chart-data-btn');
    const chartDataSourceInfo = document.querySelector('.chart-data-source-info');

    const canvasPie = document.getElementById('analyticsChart').getContext('2d');
    const canvasBar = document.getElementById('analyticsChartBar').getContext('2d');
    const canvasLine = document.getElementById('analyticsChartLine').getContext('2d');
    
    let pieChart, barChart, lineChart;
    let currentChartType = 'pie';

   
    const partsDataDefault = [ 
        { id: 1, name: "Двигун V6 Turbo", category: "engine", price: 25000 },
        { id: 2, name: "Гальмівні колодки керамічні", category: "brakes", price: 1200 },
        { id: 3, name: "Амортизатор газомасляний", category: "suspension", price: 1800 },
        { id: 4, name: "Фільтр масляний", category: "filters", price: 350 },
        { id: 5, name: "Фільтр повітряний", category: "filters", price: 450 },
        { id: 6, name: "Комплект ГРМ", category: "engine", price: 3200 },
        { id: 7, name: "Гальмівні диски вентильовані", category: "brakes", price: 2200 }
    ];

    let currentDataSource = [...partsDataDefault];

    const categoryTranslations = {
        'engine': 'Двигуни',
        'brakes': 'Гальмівна система',
        'suspension': 'Підвіска',
        'filters': 'Фільтри',
        'all': 'Всі категорії'
    };

    function getCategoryName(key) {
        return categoryTranslations[key] || key;
    }
    
    function preparePieData(dataSource) {
        const categoryCounts = dataSource.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
        return {
            labels: Object.keys(categoryCounts).map(key => getCategoryName(key)),
            data: Object.values(categoryCounts)
        };
    }

    function prepareBarData(dataSource) {
        return preparePieData(dataSource);
    }

    function prepareLineData(dataSource) {
        const priceRanges = {
            '0-1000': 0,
            '1001-5000': 0,
            '5001-10000': 0,
            '10001+': 0
        };
        dataSource.forEach(product => {
            if (product.price <= 1000) priceRanges['0-1000']++;
            else if (product.price <= 5000) priceRanges['1001-5000']++;
            else if (product.price <= 10000) priceRanges['5001-10000']++;
            else priceRanges['10001+']++;
        });
        return {
            labels: Object.keys(priceRanges),
            data: Object.values(priceRanges)
        };
    }

    // Функції для створення/оновлення графіків
    function createPieChart(data) {
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(canvasPie, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Розподіл за категоріями',
                    data: data.data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function createBarChart(data) {
        if (barChart) barChart.destroy();
        barChart = new Chart(canvasBar, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Кількість товарів у категорії',
                    data: data.data,
                    backgroundColor: '#36A2EB'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    function createLineChart(data) {
        if (lineChart) lineChart.destroy();
        lineChart = new Chart(canvasLine, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Розподіл товарів за ціною',
                    data: data.data,
                    borderColor: '#FF6384',
                    tension: 0.1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    function updateCharts() {
        const pieData = preparePieData(currentDataSource);
        createPieChart(pieData);

        const barData = prepareBarData(currentDataSource);
        createBarChart(barData);

        const lineData = prepareLineData(currentDataSource);
        createLineChart(lineData);

        showSelectedChart();
    }
    
    function showSelectedChart() {
        document.getElementById('analyticsChart').parentElement.classList.add('hidden');
        document.getElementById('analyticsChartBar').parentElement.classList.add('hidden');
        document.getElementById('analyticsChartLine').parentElement.classList.add('hidden');

        currentChartType = chartTypeSelect.value;
        if (currentChartType === 'pie') {
            document.getElementById('analyticsChart').parentElement.classList.remove('hidden');
        } else if (currentChartType === 'bar') {
            document.getElementById('analyticsChartBar').parentElement.classList.remove('hidden');
        } else if (currentChartType === 'line') {
            document.getElementById('analyticsChartLine').parentElement.classList.remove('hidden');
        }
    }


    chartTypeSelect.addEventListener('change', showSelectedChart);
    
    updateChartDataBtn.addEventListener('click', () => {
        const cartFromStorage = JSON.parse(localStorage.getItem('shoppingCartAutoDrive')) || [];
        if (cartFromStorage.length > 0) {
            currentDataSource = cartFromStorage.map(item => ({ 
                id: item.id,
                name: item.name,
                category: findProductByIdInDefault(item.id)?.category || 'unknown',
                price: item.price,
                quantity: item.quantity 
            }));
            if (chartDataSourceInfo) chartDataSourceInfo.textContent = '(Дані з кошика)';
        } else {
            currentDataSource = [...partsDataDefault];
             if (chartDataSourceInfo) chartDataSourceInfo.textContent = '(Дані з кошика порожні, показано каталог)';
        }
        updateCharts();
    });
    
    // Допоміжна функція для кнопки "Оновити дані з кошика"
    function findProductByIdInDefault(productId) {
        return partsDataDefault.find(p => p.id === parseInt(productId));
    }

    // Початкове завантаження
    updateCharts();

});