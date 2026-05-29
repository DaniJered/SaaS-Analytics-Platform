import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from '../../hooks/useTheme';

export default function AnimatedBackground({ currentTab }) {
    const canvasRef = useRef(null);
    const { theme, prefs } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Force a solid background if stockMarket background setting is disabled
        if (!prefs.stockMarket) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = theme === 'bw' ? '#0A0A0A' : '#0F1115';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            return;
        }

        const ctx = canvas.getContext('2d', { alpha: false });
        let width, height;
        
        // Setup theme-aware metrics colors
        const isBW = theme === 'bw';
        const colorBullish = isBW ? '255, 255, 255' : '16, 185, 129'; // White / Emerald Green
        const colorBearish = isBW ? '100, 100, 100' : '239, 68, 68';  // Gray / Rose Red
        const colorBg = isBW ? '#0A0A0A' : '#0B0E14';
        const colorGrid = isBW ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.08)';

        // Animation datasets
        const candlesticks = [];
        const backgroundData = [];
        const activeLines = [];
        let gridOffset = 0;
        let time = 0;

        const createTrendLine = (rgb, bias, speedMult, lineWidth) => {
            const points = [];
            const pointSpacing = 20;
            const numPoints = Math.ceil(width / pointSpacing) + 5;
            
            let currentY = height * (0.5 + bias * 0.2);
            let trend = 0;
            let trendLen = 0;

            for (let i = 0; i < numPoints; i++) {
                if (trendLen <= 0) {
                    trend = (Math.random() - 0.5) * 4 + bias;
                    trendLen = Math.floor(Math.random() * 30) + 10;
                }
                currentY += trend;
                trendLen--;
                points.push({ x: i * pointSpacing, y: currentY });
            }

            return { points, pointSpacing, rgb, bias, speed: 2 * speedMult, lineWidth, trend, trendLen };
        };

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Setup Candlesticks
            candlesticks.length = 0;
            const candleSpacing = 24;
            const numCandles = Math.ceil(width / candleSpacing) + 5;
            
            let lastClose = height * 0.5;
            for (let i = 0; i < numCandles; i++) {
                const isUp = Math.random() > 0.5;
                const change = (Math.random() * 40 + 5) * (isUp ? -1 : 1);
                const open = lastClose;
                const close = open + change;
                const high = Math.min(open, close) - Math.random() * 30;
                const low = Math.max(open, close) + Math.random() * 30;
                
                candlesticks.push({
                    x: i * candleSpacing,
                    open, close, high, low,
                    isUp: close < open
                });
                lastClose = close;
            }

            // Setup Ambient Trend Vectors
            activeLines.length = 0;
            activeLines.push(createTrendLine(colorBullish, -1.5, 0.8, 2.5));
            activeLines.push(createTrendLine(colorBearish, 1.5, 0.6, 1.5));

            // Setup scrolling backdrop text ticker feeds
            backgroundData.length = 0;
            const tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BTC', 'ETH', 'SPY', 'QQQ', 'VIX'];
            for (let i = 0; i < 60; i++) {
                backgroundData.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    speedX: - (Math.random() * 1.5 + 0.5),
                    ticker: tickers[Math.floor(Math.random() * tickers.length)],
                    price: (Math.random() * 1000 + 10).toFixed(2),
                    change: (Math.random() * 10 - 5).toFixed(2),
                    opacity: Math.random() * 0.4 + 0.1
                });
            }
        };

        const render = () => {
            time++;
            
            // Background fill
            ctx.fillStyle = colorBg;
            ctx.fillRect(0, 0, width, height);

            // 1. Render Background Grid Lines
            ctx.strokeStyle = colorGrid;
            ctx.lineWidth = 1;
            ctx.beginPath();
            
            // Adjust scrolling offset based on speed configurations
            const speedFactor = prefs.reducedMotion ? 0.1 : 1;
            gridOffset = (gridOffset + 0.5 * speedFactor) % 40;
            
            for (let x = -gridOffset; x < width; x += 40) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
            }
            for (let y = 0; y < height; y += 40) {
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // 2. Render Backdrop Ticker Feeds
            ctx.font = '12px "Inter", monospace';
            backgroundData.forEach(data => {
                data.x += data.speedX * speedFactor;
                if (data.x < -100) {
                    data.x = width + 50;
                    data.y = Math.random() * height;
                    data.price = (parseFloat(data.price) + (Math.random() - 0.5) * 5).toFixed(2);
                }
                
                const isPos = parseFloat(data.change) >= 0;
                const color = isPos ? colorBullish : colorBearish;
                
                ctx.fillStyle = `rgba(255,255,255,${data.opacity * 0.5})`;
                ctx.fillText(data.ticker, data.x, data.y);
                
                ctx.fillStyle = `rgba(${color}, ${data.opacity})`;
                ctx.fillText(`${data.price} (${isPos ? '+' : ''}${data.change}%)`, data.x + 40, data.y);
            });

            // 3. Render Candlesticks
            const candleSpeed = 1.5 * speedFactor;
            const candleWidth = 8;
            const candleSpacing = 24;

            candlesticks.forEach(c => {
                c.x -= candleSpeed;
            });

            if (candlesticks[0].x < -candleSpacing) {
                candlesticks.shift();
                const last = candlesticks[candlesticks.length - 1];
                
                const isUp = Math.random() > 0.48;
                const volatility = Math.random() * 60 + 5;
                const change = volatility * (isUp ? -1 : 1);
                const open = last.close;
                let close = open + change;
                
                if (close < height * 0.1) close += 100;
                if (close > height * 0.9) close -= 100;

                const high = Math.min(open, close) - Math.random() * 40;
                const low = Math.max(open, close) + Math.random() * 40;

                candlesticks.push({
                    x: last.x + candleSpacing,
                    open, close, high, low,
                    isUp: close < open
                });
            }

            candlesticks.forEach(c => {
                const color = c.isUp ? colorBullish : colorBearish;
                
                // Draw Wick Line
                ctx.strokeStyle = `rgba(${color}, 0.6)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(c.x + candleWidth/2, c.high);
                ctx.lineTo(c.x + candleWidth/2, c.low);
                ctx.stroke();

                // Draw solid candlestick bodies
                ctx.fillStyle = `rgba(${color}, 0.8)`;
                const bodyY = Math.min(c.open, c.close);
                const bodyH = Math.max(Math.abs(c.open - c.close), 2);
                ctx.fillRect(c.x, bodyY, candleWidth, bodyH);
            });

            // 4. Render Glowing neon Trend lines
            activeLines.forEach(line => {
                line.points.forEach(p => p.x -= line.speed * speedFactor);

                if (line.points[0].x < -line.pointSpacing) {
                    line.points.shift();
                    const last = line.points[line.points.length - 1];

                    if (line.trendLen <= 0) {
                        line.trend = (Math.random() - 0.5) * 5 + line.bias;
                        line.trendLen = Math.floor(Math.random() * 40) + 10;
                    }

                    let nextY = last.y + line.trend;
                    if (nextY < height * 0.1) line.trend += 1;
                    if (nextY > height * 0.9) line.trend -= 1;

                    line.trendLen--;
                    line.points.push({ x: last.x + line.pointSpacing, y: nextY });
                }

                ctx.beginPath();
                ctx.moveTo(line.points[0].x, line.points[0].y);
                
                for (let i = 1; i < line.points.length - 2; i++) {
                    const xc = (line.points[i].x + line.points[i + 1].x) / 2;
                    const yc = (line.points[i].y + line.points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, xc, yc);
                }
                const i = line.points.length - 2;
                ctx.quadraticCurveTo(line.points[i].x, line.points[i].y, line.points[i+1].x, line.points[i+1].y);

                // Draw outer ambient line glows
                ctx.strokeStyle = `rgba(${line.rgb}, 1)`;
                ctx.lineWidth = line.lineWidth;
                ctx.shadowBlur = prefs.reducedMotion ? 0 : 20;
                ctx.shadowColor = `rgba(${line.rgb}, 0.8)`;
                ctx.stroke();

                // Draw gradient underlays
                ctx.lineTo(line.points[line.points.length-1].x, height);
                ctx.lineTo(line.points[0].x, height);
                ctx.closePath();
                const grad = ctx.createLinearGradient(0, 0, 0, height);
                grad.addColorStop(0, `rgba(${line.rgb}, 0.2)`);
                grad.addColorStop(1, `rgba(${line.rgb}, 0.0)`);
                ctx.fillStyle = grad;
                ctx.shadowBlur = 0;
                ctx.fill();

                // Glowing neon lead particles
                const leadX = line.points[line.points.length - 2].x;
                const leadY = line.points[line.points.length - 2].y;
                ctx.beginPath();
                ctx.arc(leadX, leadY, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = prefs.reducedMotion ? 0 : 15;
                ctx.shadowColor = `rgba(${line.rgb}, 1)`;
                ctx.fill();
                
                const pulse = Math.sin(time / 10) * 4 + 8;
                ctx.beginPath();
                ctx.arc(leadX, leadY, pulse, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${line.rgb}, 0.4)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        };

        init();
        window.addEventListener('resize', init);

        // Bind standard high performance ticker callback
        gsap.ticker.add(render);

        return () => {
            gsap.ticker.remove(render);
            window.removeEventListener('resize', init);
        };
    }, [theme, prefs.stockMarket, prefs.reducedMotion]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none" data-name="animated-background-container">
            <canvas 
                ref={canvasRef} 
                className={`absolute inset-0 w-full h-full mix-blend-screen transition-opacity duration-1000 ${
                    currentTab === 'analytics' ? 'opacity-[0.25]' : currentTab === 'settings' ? 'opacity-[0.10]' : 'opacity-60'
                }`}
                data-name="animated-background" 
            />
            {/* Dark layout overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-[var(--bg-color)] opacity-50"></div>
        </div>
    );
}
