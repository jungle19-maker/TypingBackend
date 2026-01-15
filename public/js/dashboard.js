document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch User Data
        const userRes = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error('Failed to fetch user');

        const userData = await userRes.json();
        document.getElementById('usernameDisplay').textContent = userData.username;

        // Fetch History
        const historyRes = await fetch('/api/results/history', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const historyData = await historyRes.json();

        updateStats(historyData);
        renderHistory(historyData);

    } catch (err) {
        console.error(err);
        // If auth fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

function updateStats(history) {
    const totalGames = history.length;
    document.getElementById('totalGames').innerText = totalGames;

    if (totalGames > 0) {
        const avgWpm = history.reduce((acc, curr) => acc + curr.wpm, 0) / totalGames;
        const avgAcc = history.reduce((acc, curr) => acc + curr.accuracy, 0) / totalGames;

        document.getElementById('avgSpeed').innerText = Math.round(avgWpm) + ' WPM';
        document.getElementById('avgAccuracy').innerText = Math.round(avgAcc) + '%';
    }
}

function renderHistory(history) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: var(--text-muted);">No games played yet.</p>';
        return;
    }

    // Limit to last 10 games
    const recentHistory = history.slice(0, 10);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '1rem';

    // Header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">Game Mode</th>
        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">WPM</th>
        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">Accuracy</th>
        <th style="padding: 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">Date</th>
    `;
    table.appendChild(headerRow);

    recentHistory.forEach(game => {
        const row = document.createElement('tr');
        const date = new Date(game.date).toLocaleDateString();
        row.innerHTML = `
            <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${game.gameType}</td>
            <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--primary); font-weight: bold;">${game.wpm}</td>
            <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);">${game.accuracy}%</td>
            <td style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text-muted);">${date}</td>
        `;
        table.appendChild(row);
    });

    historyList.appendChild(table);
}
