(function () {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    const toggle = document.getElementById('packageThemeToggle');
    const icon = toggle.querySelector('.theme-icon');

    function updateTheme() {
        document.body.classList.toggle('dark-mode', isDark);
        icon.textContent = isDark ? 'Light' : 'Dark';
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    updateTheme();
    toggle.addEventListener('click', function () {
        isDark = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateTheme();
    });

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    pdfjsLib.getDocument('Dhruv_Kapoor_Resume_Cybersec.pdf').promise
        .then(pdf => pdf.getPage(1))
        .then(page => {
            const canvas = document.getElementById('pdfCanvas');
            const context = canvas.getContext('2d');
            const containerWidth = document.getElementById('pdfPreview').clientWidth - 32;
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(1.6, Math.max(0.5, containerWidth / baseViewport.width));
            const viewport = page.getViewport({ scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            return page.render({ canvasContext: context, viewport }).promise;
        })
        .then(() => document.getElementById('pdfStatus').remove())
        .catch(() => {
            document.getElementById('pdfStatus').textContent =
                'Preview unavailable. Use the download options below.';
        });
}());
