import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { CodeBlock } from '../../../components/ui/CodeBlock';
import { usePageTitle } from '../../../hooks/usePageTitle';

/* ─────────────────────────────────────────────
   HTML Sample Strings
   ───────────────────────────────────────────── */

const HTML_AI_NEURAL = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Style Chat</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sora', sans-serif; background: #080c14; min-height: 100vh; overflow: hidden; position: relative; }
  body::before { content: ''; position: fixed; inset: 0; background-image: linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; z-index: 0; }
  body::after { content: ''; position: fixed; bottom: -120px; right: -120px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(0,180,255,0.12) 0%, transparent 70%); pointer-events: none; z-index: 0; }
  .page-content { position: relative; z-index: 1; padding: 48px; }
  .page-title { font-family: 'Space Mono', monospace; font-size: 11px; color: rgba(0,200,255,0.5); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; }
  .page-heading { font-size: 28px; font-weight: 300; color: rgba(255,255,255,0.85); letter-spacing: -0.5px; line-height: 1.4; }
  .page-heading strong { font-weight: 600; color: #00c8ff; }
  .fab-wrapper { position: fixed; bottom: 32px; right: 32px; z-index: 100; }
  .fab-pulse { position: absolute; inset: -8px; border-radius: 50%; border: 1px solid rgba(0,200,255,0.3); animation: pulse-ring 2.4s ease-out infinite; }
  .fab-pulse:nth-child(2) { animation-delay: 0.8s; }
  .fab-pulse:nth-child(3) { animation-delay: 1.6s; }
  @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
  .fab-btn { position: relative; width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer; background: transparent; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
  .fab-btn:hover { transform: scale(1.05); }
  .fab-btn:active { transform: scale(0.96); }
  .fab-svg-wrap { position: relative; width: 60px; height: 60px; }
  .chat-popup { position: fixed; bottom: 108px; right: 32px; width: 340px; background: rgba(10,16,28,0.95); border: 1px solid rgba(0,200,255,0.2); border-radius: 20px; overflow: hidden; transform-origin: bottom right; transform: scale(0.88) translateY(16px); opacity: 0; pointer-events: none; transition: all 0.25s cubic-bezier(.4,0,.2,1); z-index: 99; backdrop-filter: blur(20px); }
  .chat-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
  .chat-header { position: relative; padding: 16px 18px 14px; background: rgba(0,200,255,0.07); border-bottom: 1px solid rgba(0,200,255,0.15); overflow: hidden; }
  .chat-header::after { content: ''; position: absolute; top: -50%; left: -20%; width: 60%; height: 200%; background: linear-gradient(90deg, transparent, rgba(0,200,255,0.05), transparent); animation: scan 3s ease-in-out infinite; }
  @keyframes scan { 0% { left: -60%; } 100% { left: 120%; } }
  .header-top { display: flex; align-items: center; gap: 10px; position: relative; z-index: 1; }
  .ai-avatar { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(0,200,255,0.4); background: rgba(0,200,255,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .header-info { flex: 1; }
  .header-name { font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; color: #00c8ff; letter-spacing: 0.5px; }
  .header-sub { font-size: 10px; color: rgba(0,200,255,0.5); font-family: 'Space Mono', monospace; letter-spacing: 0.3px; margin-top: 1px; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 6px #00ff88; animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .close-x { background: none; border: none; cursor: pointer; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: rgba(0,200,255,0.5); font-size: 16px; line-height: 1; transition: background 0.15s, color 0.15s; }
  .close-x:hover { background: rgba(0,200,255,0.1); color: #00c8ff; }
  .chat-messages { padding: 16px 14px 10px; display: flex; flex-direction: column; gap: 12px; min-height: 140px; }
  .msg { display: flex; gap: 8px; align-items: flex-end; }
  .msg.user { flex-direction: row-reverse; }
  .msg-av { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; border: 1px solid rgba(0,200,255,0.3); background: rgba(0,200,255,0.08); display: flex; align-items: center; justify-content: center; font-family: 'Space Mono', monospace; font-size: 8px; color: #00c8ff; }
  .bubble { max-width: 210px; font-size: 13px; line-height: 1.55; padding: 9px 13px; border-radius: 14px; font-family: 'Sora', sans-serif; font-weight: 400; }
  .msg.bot .bubble { background: rgba(0,200,255,0.08); border: 1px solid rgba(0,200,255,0.15); color: rgba(255,255,255,0.82); border-bottom-left-radius: 4px; }
  .msg.user .bubble { background: rgba(0,200,255,0.18); border: 1px solid rgba(0,200,255,0.3); color: #00e5ff; border-bottom-right-radius: 4px; }
  .greeting { display: flex; flex-direction: column; align-items: center; padding: 24px 18px 8px; text-align: center; }
  .greeting-icon { width: 48px; height: 48px; border: 1px solid rgba(0,200,255,0.25); border-radius: 14px; background: rgba(0,200,255,0.06); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .greeting-title { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; color: #00c8ff; margin-bottom: 6px; }
  .greeting-sub { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.6; }
  .chat-input-row { border-top: 1px solid rgba(0,200,255,0.1); padding: 10px 12px; display: flex; gap: 8px; align-items: center; background: rgba(0,200,255,0.02); }
  .chat-input { flex: 1; background: rgba(0,200,255,0.06); border: 1px solid rgba(0,200,255,0.15); border-radius: 10px; padding: 8px 12px; font-size: 12px; font-family: 'Sora', sans-serif; color: rgba(255,255,255,0.8); outline: none; transition: border-color 0.2s; }
  .chat-input::placeholder { color: rgba(0,200,255,0.3); }
  .chat-input:focus { border-color: rgba(0,200,255,0.4); }
  .send-btn { width: 32px; height: 32px; border-radius: 8px; background: rgba(0,200,255,0.15); border: 1px solid rgba(0,200,255,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
  .send-btn:hover { background: rgba(0,200,255,0.25); }
  .powered { text-align: center; padding: 6px; font-family: 'Space Mono', monospace; font-size: 9px; color: rgba(0,200,255,0.2); letter-spacing: 1px; }
</style>
</head>
<body>
<div class="page-content">
  <div class="page-title">// INTERFACE v2.4</div>
  <div class="page-heading">Neural<br><strong>Assistant</strong><br><span style="font-size:14px;color:rgba(255,255,255,0.3);font-weight:300;">Powered by AI · Always Online</span></div>
</div>
<div class="chat-popup" id="popup">
  <div class="chat-header">
    <div class="header-top">
      <div class="ai-avatar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="#00c8ff"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#00c8ff" stroke-width="1.5" stroke-linecap="round"/><path d="M6.34 6.34l2.12 2.12M15.54 15.54l2.12 2.12M6.34 17.66l2.12-2.12M15.54 8.46l2.12-2.12" stroke="#00c8ff" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/></svg></div>
      <div class="header-info"><div class="header-name">NEURAL.AI</div><div class="header-sub">● SYSTEM ONLINE</div></div>
      <div class="status-dot"></div>
      <button class="close-x" id="closeBtn">✕</button>
    </div>
  </div>
  <div class="chat-messages">
    <div class="greeting">
      <div class="greeting-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" stroke="#00c8ff" stroke-width="1.5" stroke-linecap="round"/></svg></div>
      <div class="greeting-title">INITIALIZING...</div>
      <div class="greeting-sub">Neural assistant ready.<br>무엇이든 물어보세요.</div>
    </div>
  </div>
  <div class="chat-input-row">
    <input class="chat-input" placeholder="쿼리를 입력하세요..." id="msgInput"/>
    <button class="send-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#00c8ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>
  <div class="powered">POWERED BY AI CORE</div>
</div>
<div class="fab-wrapper">
  <div class="fab-pulse"></div><div class="fab-pulse"></div><div class="fab-pulse"></div>
  <button class="fab-btn" id="fabBtn">
    <div class="fab-svg-wrap">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="28" fill="#080c14" stroke="url(#fabGrad)" stroke-width="1.5"/>
        <circle cx="30" cy="30" r="22" fill="rgba(0,200,255,0.06)" stroke="rgba(0,200,255,0.15)" stroke-width="1"/>
        <circle cx="30" cy="22" r="2.5" fill="#00c8ff"/>
        <circle cx="22" cy="34" r="2" fill="#00c8ff" opacity="0.7"/>
        <circle cx="38" cy="34" r="2" fill="#00c8ff" opacity="0.7"/>
        <line x1="30" y1="22" x2="22" y2="34" stroke="#00c8ff" stroke-width="1" opacity="0.4"/>
        <line x1="30" y1="22" x2="38" y2="34" stroke="#00c8ff" stroke-width="1" opacity="0.4"/>
        <line x1="22" y1="34" x2="38" y2="34" stroke="#00c8ff" stroke-width="1" opacity="0.3"/>
        <circle cx="30" cy="30" r="1.5" fill="#00c8ff" opacity="0.5"/>
        <defs><linearGradient id="fabGrad" x1="0" y1="0" x2="60" y2="60"><stop offset="0%" stop-color="#00c8ff"/><stop offset="100%" stop-color="#0050ff"/></linearGradient></defs>
      </svg>
    </div>
  </button>
</div>
<script>
const fab=document.getElementById('fabBtn'),popup=document.getElementById('popup'),closeBtn=document.getElementById('closeBtn');
let isOpen=false;
function toggle(open){isOpen=open;popup.classList.toggle('open',open);}
fab.addEventListener('click',()=>toggle(!isOpen));
closeBtn.addEventListener('click',()=>toggle(false));
document.getElementById('msgInput').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.value.trim()){
    const msgs=popup.querySelector('.chat-messages');msgs.innerHTML='';
    const div=document.createElement('div');div.className='msg user';
    div.innerHTML='<div class="msg-av">ME</div><div class="bubble">'+e.target.value+'</div>';
    msgs.appendChild(div);e.target.value='';
    setTimeout(()=>{const bot=document.createElement('div');bot.className='msg bot';
    bot.innerHTML='<div class="msg-av">AI</div><div class="bubble">신호 수신 완료. 처리 중입니다...</div>';
    msgs.appendChild(bot);},700);
  }
});
</script>
</body>
</html>`;

const HTML_CYBERPUNK = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cyberpunk Chat</title>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --pink: #ff2d78; --cyan: #00f5ff; --dark: #0a0010; --surface: #110020; }
  body { font-family: 'Rajdhani', sans-serif; background: var(--dark); min-height: 100vh; overflow: hidden; position: relative; }
  body::before { content: ''; position: fixed; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,45,120,0.015) 2px, rgba(255,45,120,0.015) 4px); pointer-events: none; z-index: 0; }
  .bg-glow { position: fixed; top: -100px; left: -100px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(255,45,120,0.08) 0%, transparent 70%); pointer-events: none; }
  .bg-glow2 { position: fixed; bottom: -150px; right: -100px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%); pointer-events: none; }
  .page-content { position: relative; z-index: 1; padding: 48px; }
  .page-label { font-family: 'Orbitron', monospace; font-size: 10px; color: var(--pink); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px; }
  .page-heading { font-family: 'Orbitron', monospace; font-size: 26px; font-weight: 900; line-height: 1.2; }
  .page-heading .c1 { color: var(--pink); text-shadow: 0 0 20px rgba(255,45,120,0.6); }
  .page-heading .c2 { color: var(--cyan); text-shadow: 0 0 20px rgba(0,245,255,0.5); }
  .page-heading .c3 { color: rgba(255,255,255,0.3); font-size: 14px; font-weight: 400; display: block; margin-top: 8px; font-family: 'Rajdhani', sans-serif; letter-spacing: 2px; }

  /* FAB */
  .fab-wrapper { position: fixed; bottom: 32px; right: 32px; z-index: 100; }
  .fab-hex { position: relative; width: 62px; height: 62px; cursor: pointer; transition: transform 0.2s; }
  .fab-hex:hover { transform: scale(1.08); }
  .fab-hex:active { transform: scale(0.94); }
  .hex-bg { width: 62px; height: 62px; background: linear-gradient(135deg, var(--pink), #a000ff); clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 24px rgba(255,45,120,0.5), 0 0 48px rgba(255,45,120,0.2); }
  .hex-inner { font-size: 24px; line-height: 1; }
  .hex-ring { position: absolute; inset: -6px; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); border: 2px solid rgba(255,45,120,0.4); animation: spin-ring 4s linear infinite; }
  @keyframes spin-ring { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }

  /* Popup */
  .chat-popup { position: fixed; bottom: 112px; right: 32px; width: 340px; background: rgba(10,0,20,0.96); border: 1px solid rgba(255,45,120,0.25); border-radius: 0 20px 20px 20px; overflow: hidden; transform-origin: bottom right; transform: scale(0.85) translateY(20px); opacity: 0; pointer-events: none; transition: all 0.22s cubic-bezier(.4,0,.2,1); z-index: 99; backdrop-filter: blur(24px); }
  .chat-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

  /* Header */
  .chat-header { padding: 14px 16px; background: linear-gradient(135deg, rgba(255,45,120,0.12), rgba(0,245,255,0.06)); border-bottom: 1px solid rgba(255,45,120,0.2); display: flex; align-items: center; gap: 10px; position: relative; overflow: hidden; }
  .glitch-bar { position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,45,120,0.08), transparent); animation: glitch-scan 2.5s ease-in-out infinite; }
  @keyframes glitch-scan { 0% { left: -60%; } 100% { left: 120%; } }
  .cp-avatar { width: 36px; height: 36px; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); background: linear-gradient(135deg, var(--pink), #8000ff); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; position: relative; z-index: 1; }
  .header-text { flex: 1; position: relative; z-index: 1; }
  .header-name { font-family: 'Orbitron', monospace; font-size: 11px; font-weight: 700; color: var(--pink); letter-spacing: 1px; text-shadow: 0 0 8px rgba(255,45,120,0.5); }
  .header-status { font-size: 10px; color: var(--cyan); font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; margin-top: 1px; }
  .close-btn { background: none; border: 1px solid rgba(255,45,120,0.3); border-radius: 4px; color: rgba(255,45,120,0.7); cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.15s; position: relative; z-index: 1; }
  .close-btn:hover { background: rgba(255,45,120,0.15); color: var(--pink); }

  /* Messages */
  .chat-body { padding: 14px 12px 8px; min-height: 150px; display: flex; flex-direction: column; gap: 10px; }
  .cp-intro { text-align: center; padding: 16px 12px; }
  .cp-intro-icon { font-size: 32px; margin-bottom: 8px; display: block; }
  .cp-intro-title { font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 700; color: var(--pink); margin-bottom: 4px; text-shadow: 0 0 10px rgba(255,45,120,0.4); }
  .cp-intro-sub { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; font-family: 'Rajdhani', sans-serif; }
  .msg-row { display: flex; gap: 8px; align-items: flex-end; }
  .msg-row.user { flex-direction: row-reverse; }
  .av { width: 22px; height: 22px; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 8px; font-family: 'Orbitron', monospace; font-weight: 700; }
  .av.bot { background: linear-gradient(135deg, var(--pink), #8000ff); color: #fff; }
  .av.me { background: linear-gradient(135deg, var(--cyan), #0080ff); color: #000; }
  .bub { max-width: 210px; font-size: 13px; line-height: 1.5; padding: 8px 12px; border-radius: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 500; }
  .bub.bot { background: rgba(255,45,120,0.1); border: 1px solid rgba(255,45,120,0.2); color: rgba(255,255,255,0.85); border-bottom-left-radius: 3px; }
  .bub.me { background: rgba(0,245,255,0.12); border: 1px solid rgba(0,245,255,0.25); color: var(--cyan); border-bottom-right-radius: 3px; }

  /* Input */
  .chat-input-row { border-top: 1px solid rgba(255,45,120,0.15); padding: 10px 12px; display: flex; gap: 8px; align-items: center; }
  .cp-input { flex: 1; background: rgba(255,45,120,0.06); border: 1px solid rgba(255,45,120,0.2); border-radius: 8px; padding: 7px 11px; font-size: 12px; font-family: 'Rajdhani', sans-serif; color: rgba(255,255,255,0.8); outline: none; transition: border-color 0.2s; }
  .cp-input::placeholder { color: rgba(255,45,120,0.3); }
  .cp-input:focus { border-color: rgba(255,45,120,0.5); }
  .cp-send { width: 30px; height: 30px; border-radius: 6px; background: linear-gradient(135deg, var(--pink), #8000ff); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 10px rgba(255,45,120,0.3); transition: opacity 0.15s; }
  .cp-send:hover { opacity: 0.85; }
  .cp-footer { text-align: center; padding: 5px; font-family: 'Orbitron', monospace; font-size: 8px; color: rgba(255,45,120,0.2); letter-spacing: 2px; }
</style>
</head>
<body>
<div class="bg-glow"></div>
<div class="bg-glow2"></div>
<div class="page-content">
  <div class="page-label">// CYBER_NET v3.0</div>
  <div class="page-heading">
    <span class="c1">DIGITAL</span><br>
    <span class="c2">PUNK</span>
    <span class="c3">CONNECT · TRANSMIT · EVOLVE</span>
  </div>
</div>
<div class="chat-popup" id="popup">
  <div class="chat-header">
    <div class="glitch-bar"></div>
    <div class="cp-avatar">⚡</div>
    <div class="header-text">
      <div class="header-name">CYBER.CHAT</div>
      <div class="header-status">◈ SIGNAL: STRONG · ENCRYPTED</div>
    </div>
    <button class="close-btn" id="closeBtn">✕</button>
  </div>
  <div class="chat-body" id="chatBody">
    <div class="cp-intro">
      <span class="cp-intro-icon">⚡</span>
      <div class="cp-intro-title">CONNECTED</div>
      <div class="cp-intro-sub">사이버 네트워크 연결 완료.<br>메시지를 전송하세요.</div>
    </div>
  </div>
  <div class="chat-input-row">
    <input class="cp-input" placeholder="TRANSMIT MESSAGE..." id="msgInput"/>
    <button class="cp-send" id="sendBtn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>
  <div class="cp-footer">CYBER_NET · END-TO-END ENCRYPTED</div>
</div>
<div class="fab-wrapper">
  <button class="fab-hex" id="fabBtn">
    <div class="hex-ring"></div>
    <div class="hex-bg">
      <span class="hex-inner">⚡</span>
    </div>
  </button>
</div>
<script>
const fab=document.getElementById('fabBtn'),popup=document.getElementById('popup'),closeBtn=document.getElementById('closeBtn');
let isOpen=false;
function toggle(open){isOpen=open;popup.classList.toggle('open',open);}
fab.addEventListener('click',()=>toggle(!isOpen));
closeBtn.addEventListener('click',()=>toggle(false));
function sendMsg(){
  const input=document.getElementById('msgInput');
  if(!input.value.trim())return;
  const body=document.getElementById('chatBody');
  body.innerHTML='';
  const uRow=document.createElement('div');uRow.className='msg-row user';
  uRow.innerHTML='<div class="av me">ME</div><div class="bub me">'+input.value+'</div>';
  body.appendChild(uRow);
  input.value='';
  setTimeout(()=>{
    const bRow=document.createElement('div');bRow.className='msg-row';
    bRow.innerHTML='<div class="av bot">AI</div><div class="bub bot">신호 수신. 데이터 처리 중...</div>';
    body.appendChild(bRow);
  },600);
}
document.getElementById('sendBtn').addEventListener('click',sendMsg);
document.getElementById('msgInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg();});
</script>
</body>
</html>`;

const HTML_SUPPORT = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Support Chat</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f0f4f8; min-height: 100vh; overflow: hidden; }
  .page-content { padding: 48px; }
  .page-title { font-size: 13px; font-weight: 600; color: #94a3b8; letter-spacing: 0.3px; margin-bottom: 10px; }
  .page-heading { font-size: 30px; font-weight: 700; color: #1e293b; line-height: 1.3; }
  .page-heading span { color: #3b82f6; }
  .page-sub { font-size: 14px; color: #64748b; margin-top: 8px; line-height: 1.6; }

  /* FAB */
  .fab-wrapper { position: fixed; bottom: 28px; right: 28px; z-index: 100; }
  .badge { position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; border-radius: 50%; background: #ef4444; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #f0f4f8; z-index: 1; animation: badge-pulse 2s ease-in-out infinite; }
  @keyframes badge-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .fab-btn { width: 58px; height: 58px; border-radius: 50%; border: none; cursor: pointer; background: linear-gradient(135deg, #3b82f6, #1d4ed8); box-shadow: 0 4px 20px rgba(59,130,246,0.4), 0 2px 8px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; transition: transform 0.2s, box-shadow 0.2s; }
  .fab-btn:hover { transform: scale(1.06); box-shadow: 0 6px 28px rgba(59,130,246,0.5), 0 3px 12px rgba(0,0,0,0.15); }
  .fab-btn:active { transform: scale(0.95); }

  /* Popup */
  .chat-popup { position: fixed; bottom: 102px; right: 28px; width: 360px; background: #fff; border-radius: 20px; box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; transform-origin: bottom right; transform: scale(0.9) translateY(16px); opacity: 0; pointer-events: none; transition: all 0.22s cubic-bezier(.4,0,.2,1); z-index: 99; }
  .chat-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

  /* Header */
  .chat-header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); padding: 16px 18px; display: flex; align-items: center; gap: 12px; }
  .agent-av { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .agent-info { flex: 1; }
  .agent-name { font-size: 14px; font-weight: 600; color: #fff; }
  .agent-status { font-size: 11px; color: rgba(255,255,255,0.75); margin-top: 2px; display: flex; align-items: center; gap: 5px; }
  .online-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 5px #4ade80; animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .close-btn { background: rgba(255,255,255,0.15); border: none; border-radius: 8px; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); font-size: 14px; transition: background 0.15s; }
  .close-btn:hover { background: rgba(255,255,255,0.25); }

  /* Chat body */
  .chat-body { padding: 16px 14px 10px; min-height: 160px; display: flex; flex-direction: column; gap: 12px; }
  .welcome-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; }
  .wc-icon { font-size: 22px; margin-bottom: 8px; }
  .wc-title { font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
  .wc-sub { font-size: 12px; color: #64748b; line-height: 1.6; }
  .quick-btns { display: flex; flex-direction: column; gap: 6px; }
  .quick-btn { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 9px 13px; font-size: 12px; font-weight: 500; color: #374151; cursor: pointer; text-align: left; transition: all 0.15s; display: flex; align-items: center; gap: 8px; }
  .quick-btn:hover { background: #eff6ff; border-color: #93c5fd; color: #1d4ed8; }
  .msg-row { display: flex; gap: 8px; align-items: flex-end; }
  .msg-row.user { flex-direction: row-reverse; }
  .av { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .av.bot { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
  .av.me { background: #e2e8f0; font-size: 11px; font-weight: 600; color: #64748b; }
  .bub { max-width: 220px; font-size: 13px; line-height: 1.55; padding: 9px 13px; border-radius: 16px; }
  .bub.bot { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }
  .bub.me { background: #3b82f6; color: #fff; border-bottom-right-radius: 4px; }

  /* Input */
  .chat-input-row { border-top: 1px solid #f1f5f9; padding: 10px 12px; display: flex; gap: 8px; align-items: center; }
  .sp-input { flex: 1; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; font-size: 13px; font-family: 'Inter', sans-serif; color: #1e293b; outline: none; transition: border-color 0.2s; }
  .sp-input::placeholder { color: #94a3b8; }
  .sp-input:focus { border-color: #93c5fd; background: #fff; }
  .sp-send { width: 34px; height: 34px; border-radius: 10px; background: #3b82f6; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
  .sp-send:hover { background: #1d4ed8; }
  .sp-footer { text-align: center; padding: 6px; font-size: 10px; color: #94a3b8; }
</style>
</head>
<body>
<div class="page-content">
  <div class="page-title">고객 지원 센터</div>
  <div class="page-heading">안녕하세요!<br><span>무엇을 도와드릴까요?</span></div>
  <div class="page-sub">우측 하단 채팅 버튼을 클릭해<br>상담사에게 문의하세요.</div>
</div>
<div class="chat-popup" id="popup">
  <div class="chat-header">
    <div class="agent-av">👩‍💼</div>
    <div class="agent-info">
      <div class="agent-name">김지원 상담사</div>
      <div class="agent-status"><span class="online-dot"></span>온라인 · 평균 응답 1분</div>
    </div>
    <button class="close-btn" id="closeBtn">✕</button>
  </div>
  <div class="chat-body" id="chatBody">
    <div class="welcome-card">
      <div class="wc-icon">👋</div>
      <div class="wc-title">안녕하세요!</div>
      <div class="wc-sub">저는 김지원 상담사입니다. 아래 빠른 질문 버튼을 눌러 시작하거나, 직접 메시지를 입력해 주세요.</div>
    </div>
    <div class="quick-btns">
      <button class="quick-btn" onclick="quickAsk('배송 조회를 하고 싶어요')">📦 배송 현황 조회</button>
      <button class="quick-btn" onclick="quickAsk('환불/교환 문의가 있어요')">🔄 환불 · 교환 문의</button>
      <button class="quick-btn" onclick="quickAsk('제품 사용 방법을 알고 싶어요')">❓ 제품 사용 방법</button>
    </div>
  </div>
  <div class="chat-input-row">
    <input class="sp-input" placeholder="메시지를 입력하세요..." id="msgInput"/>
    <button class="sp-send" id="sendBtn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>
  <div class="sp-footer">WorkKit 고객 지원 · 운영시간 09:00–18:00</div>
</div>
<div class="fab-wrapper">
  <div class="badge" id="badge">1</div>
  <button class="fab-btn" id="fabBtn">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="rgba(255,255,255,0.2)" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
</div>
<script>
const fab=document.getElementById('fabBtn'),popup=document.getElementById('popup'),closeBtn=document.getElementById('closeBtn'),badge=document.getElementById('badge');
let isOpen=false;
function toggle(open){isOpen=open;popup.classList.toggle('open',open);if(open){badge.style.display='none';}}
fab.addEventListener('click',()=>toggle(!isOpen));
closeBtn.addEventListener('click',()=>toggle(false));
function addMsg(text,type){
  const body=document.getElementById('chatBody');
  const row=document.createElement('div');row.className='msg-row'+(type==='user'?' user':'');
  const av=type==='user'?'<div class="av me">나</div>':'<div class="av bot">👩‍💼</div>';
  const cls=type==='user'?'me':'bot';
  row.innerHTML=av+'<div class="bub '+cls+'">'+text+'</div>';
  body.appendChild(row);
  body.scrollTop=body.scrollHeight;
}
function quickAsk(text){
  const body=document.getElementById('chatBody');body.innerHTML='';
  addMsg(text,'user');
  setTimeout(()=>addMsg('문의 주셔서 감사합니다! 확인 후 빠르게 답변드리겠습니다.','bot'),800);
}
function sendMsg(){
  const input=document.getElementById('msgInput');
  if(!input.value.trim())return;
  const text=input.value;input.value='';
  const body=document.getElementById('chatBody');
  if(body.querySelector('.welcome-card'))body.innerHTML='';
  addMsg(text,'user');
  setTimeout(()=>addMsg('메시지를 받았습니다. 잠시만 기다려 주세요!','bot'),700);
}
document.getElementById('sendBtn').addEventListener('click',sendMsg);
document.getElementById('msgInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg();});
</script>
</body>
</html>`;

const HTML_CUTE_CAT = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cute Cat Chat</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Nunito', sans-serif; background: linear-gradient(135deg, #fff0f6 0%, #fdf4ff 50%, #f0f8ff 100%); min-height: 100vh; overflow: hidden; position: relative; }
  .dot { position: fixed; border-radius: 50%; pointer-events: none; animation: float-dot linear infinite; opacity: 0.4; }
  @keyframes float-dot { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 0.4; } 90% { opacity: 0.4; } 100% { transform: translateY(-100px) scale(1); opacity: 0; } }
  .page-content { position: relative; z-index: 1; padding: 48px; }
  .page-emoji { font-size: 36px; margin-bottom: 10px; }
  .page-heading { font-size: 28px; font-weight: 900; color: #1a1a2e; line-height: 1.3; }
  .page-heading span { color: #ff6b9d; }
  .page-sub { font-size: 14px; color: #94a3b8; margin-top: 8px; line-height: 1.7; font-weight: 600; }

  /* FAB */
  .fab-wrapper { position: fixed; bottom: 28px; right: 28px; z-index: 100; }
  .fab-ears { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); width: 64px; height: 20px; pointer-events: none; }
  .ear { position: absolute; width: 0; height: 0; border-style: solid; }
  .ear-l { left: 4px; border-width: 0 10px 16px 10px; border-color: transparent transparent #ff6b9d transparent; }
  .ear-r { right: 4px; border-width: 0 10px 16px 10px; border-color: transparent transparent #ff6b9d transparent; }
  .fab-btn { width: 62px; height: 62px; border-radius: 50%; border: none; cursor: pointer; background: linear-gradient(135deg, #ff6b9d, #ff8fab); box-shadow: 0 4px 18px rgba(255,107,157,0.4), 0 2px 8px rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 28px; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
  .fab-btn:hover { transform: scale(1.08) translateY(-2px); box-shadow: 0 8px 28px rgba(255,107,157,0.5); }
  .fab-btn:active { transform: scale(0.95); }
  .fab-tail { position: absolute; bottom: -8px; right: -6px; font-size: 20px; line-height: 1; animation: wag 2s ease-in-out infinite; transform-origin: top left; }
  @keyframes wag { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }

  /* Popup */
  .chat-popup { position: fixed; bottom: 108px; right: 28px; width: 330px; background: #fff; border-radius: 24px; box-shadow: 0 8px 40px rgba(255,107,157,0.15), 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; transform-origin: bottom right; transform: scale(0.88) translateY(16px); opacity: 0; pointer-events: none; transition: all 0.25s cubic-bezier(.4,0,.2,1); z-index: 99; border: 2px solid rgba(255,107,157,0.15); }
  .chat-popup.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

  /* Header */
  .chat-header { background: linear-gradient(135deg, #ff6b9d, #ff8fab); padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
  .cat-av { width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; position: relative; }
  .cat-ear { position: absolute; width: 0; height: 0; border-style: solid; border-width: 0 5px 8px 5px; top: -6px; }
  .cat-ear.l { left: 4px; border-color: transparent transparent rgba(255,255,255,0.6) transparent; }
  .cat-ear.r { right: 4px; border-color: transparent transparent rgba(255,255,255,0.6) transparent; }
  .header-info { flex: 1; }
  .header-name { font-size: 13px; font-weight: 800; color: #fff; }
  .header-status { font-size: 10px; color: rgba(255,255,255,0.8); margin-top: 1px; }
  .close-btn { background: rgba(255,255,255,0.2); border: none; border-radius: 8px; width: 26px; height: 26px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); font-size: 14px; transition: background 0.15s; }
  .close-btn:hover { background: rgba(255,255,255,0.35); }

  /* Body */
  .chat-body { padding: 14px 12px 8px; min-height: 160px; display: flex; flex-direction: column; gap: 10px; background: #fff8fc; }
  .welcome { text-align: center; padding: 16px 12px; }
  .w-emoji { font-size: 40px; display: block; margin-bottom: 10px; animation: bounce-cat 2s ease-in-out infinite; }
  @keyframes bounce-cat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .w-title { font-size: 15px; font-weight: 900; color: #1a1a2e; margin-bottom: 4px; }
  .w-sub { font-size: 12px; color: #94a3b8; line-height: 1.7; font-weight: 600; }
  .paw-btns { display: flex; flex-direction: column; gap: 6px; }
  .paw-btn { background: #fff0f6; border: 2px solid #ffd6e7; border-radius: 12px; padding: 9px 13px; font-size: 12px; font-weight: 700; color: #ff6b9d; cursor: pointer; text-align: left; transition: all 0.15s; font-family: 'Nunito', sans-serif; display: flex; align-items: center; gap: 8px; }
  .paw-btn:hover { background: #ffe4ef; border-color: #ffb3cc; transform: translateX(2px); }
  .msg-row { display: flex; gap: 8px; align-items: flex-end; }
  .msg-row.user { flex-direction: row-reverse; }
  .av { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .av.me { background: #e2e8f0; font-size: 10px; font-weight: 800; color: #94a3b8; }
  .bub { max-width: 210px; font-size: 13px; line-height: 1.55; padding: 9px 13px; border-radius: 16px; font-weight: 600; }
  .bub.bot { background: #fff0f6; color: #1a1a2e; border-bottom-left-radius: 4px; border: 1.5px solid #ffd6e7; }
  .bub.me { background: linear-gradient(135deg, #ff6b9d, #ff8fab); color: #fff; border-bottom-right-radius: 4px; }

  /* Input */
  .chat-input-row { border-top: 2px solid #fff0f6; padding: 10px 12px; display: flex; gap: 8px; align-items: center; background: #fff; }
  .cat-input { flex: 1; background: #fff8fc; border: 2px solid #ffd6e7; border-radius: 12px; padding: 8px 12px; font-size: 12px; font-family: 'Nunito', sans-serif; font-weight: 600; color: #1a1a2e; outline: none; transition: border-color 0.2s; }
  .cat-input::placeholder { color: #ffb3cc; }
  .cat-input:focus { border-color: #ff6b9d; }
  .cat-send { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #ff6b9d, #ff8fab); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; transition: transform 0.15s; }
  .cat-send:hover { transform: scale(1.1); }
  .cat-footer { text-align: center; padding: 6px; font-size: 10px; color: #ffb3cc; font-weight: 700; }
</style>
</head>
<body>
<div class="page-content">
  <div class="page-emoji">🌸</div>
  <div class="page-heading">귀여운<br><span>냥이 챗</span></div>
  <div class="page-sub">우측 하단 냥이 버튼을 클릭해봐요!<br>귀엽고 사랑스러운 채팅이 시작됩니다 🐱</div>
</div>
<div class="chat-popup" id="popup">
  <div class="chat-header">
    <div class="cat-av"><span class="cat-ear l"></span><span class="cat-ear r"></span>🐱</div>
    <div class="header-info">
      <div class="header-name">냥이 어시스턴트</div>
      <div class="header-status">🌸 온라인 · 냥냥~</div>
    </div>
    <button class="close-btn" id="closeBtn">✕</button>
  </div>
  <div class="chat-body" id="chatBody">
    <div class="welcome">
      <span class="w-emoji">🐱</span>
      <div class="w-title">안녕하세요, 냥~!</div>
      <div class="w-sub">저는 냥이 어시스턴트예요! 🐾<br>무엇이든 물어봐 주세요 ₍^. .^₎</div>
    </div>
    <div class="paw-btns">
      <button class="paw-btn" onclick="quickMsg('상품 추천해줘!')">🛍️ 상품 추천받기</button>
      <button class="paw-btn" onclick="quickMsg('귀여운 거 보여줘!')">🎀 귀여운 소식 보기</button>
      <button class="paw-btn" onclick="quickMsg('배송이 궁금해요!')">📦 배송 조회하기</button>
    </div>
  </div>
  <div class="chat-input-row">
    <input class="cat-input" placeholder="메시지를 입력해요 🐾" id="msgInput"/>
    <button class="cat-send" id="sendBtn">🐾</button>
  </div>
  <div class="cat-footer">🐱 냥이 챗봇 · 항상 여기 있어요!</div>
</div>
<div class="fab-wrapper">
  <div class="fab-ears"><span class="ear ear-l"></span><span class="ear ear-r"></span></div>
  <button class="fab-btn" id="fabBtn">🐱<span class="fab-tail">🐾</span></button>
</div>
<script>
(function(){
  const colors=['#ffb3cc','#ffd6e7','#ffe4ef','#ffc8dc','#ffaac5'];
  for(let i=0;i<8;i++){
    const d=document.createElement('div');d.className='dot';
    const size=Math.random()*8+4;
    d.style.cssText='width:'+size+'px;height:'+size+'px;left:'+Math.random()*100+'vw;background:'+colors[Math.floor(Math.random()*colors.length)]+';animation-duration:'+(Math.random()*8+6)+'s;animation-delay:'+(Math.random()*6)+'s;';
    document.body.appendChild(d);
  }
})();
const fab=document.getElementById('fabBtn'),popup=document.getElementById('popup'),closeBtn=document.getElementById('closeBtn');
let isOpen=false;
function toggle(open){isOpen=open;popup.classList.toggle('open',open);}
fab.addEventListener('click',()=>toggle(!isOpen));
closeBtn.addEventListener('click',()=>toggle(false));
const replies=['냥~ 알겠어요! 🐾','네네, 도와드릴게요 🌸','냥냥~ 잠깐만요! 🐱','귀여운 답변 준비중이에요 💕'];
function addMsg(text,type){
  const body=document.getElementById('chatBody');
  const row=document.createElement('div');row.className='msg-row'+(type==='user'?' user':'');
  const av=type==='user'?'<div class="av me">나</div>':'<div class="av">🐱</div>';
  const cls=type==='user'?'me':'bot';
  row.innerHTML=av+'<div class="bub '+cls+'">'+text+'</div>';
  body.appendChild(row);body.scrollTop=body.scrollHeight;
}
function quickMsg(text){
  const body=document.getElementById('chatBody');body.innerHTML='';
  addMsg(text,'user');
  setTimeout(()=>addMsg(replies[Math.floor(Math.random()*replies.length)],'bot'),700);
}
function sendMsg(){
  const input=document.getElementById('msgInput');
  if(!input.value.trim())return;
  const text=input.value;input.value='';
  const body=document.getElementById('chatBody');
  if(body.querySelector('.welcome'))body.innerHTML='';
  addMsg(text,'user');
  setTimeout(()=>addMsg(replies[Math.floor(Math.random()*replies.length)],'bot'),700);
}
document.getElementById('sendBtn').addEventListener('click',sendMsg);
document.getElementById('msgInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg();});
</script>
</body>
</html>`;

/* ─────────────────────────────────────────────
   Shared Styles (inline objects)
   ───────────────────────────────────────────── */

const s = {
  h2: {
    fontSize: '20px',
    fontWeight: 800,
    fontFamily: 'Nunito, sans-serif',
    color: 'var(--text)',
    marginTop: '40px',
    marginBottom: '12px',
    lineHeight: 1.4,
  } as React.CSSProperties,

  p: {
    fontSize: '15px',
    lineHeight: 1.8,
    color: 'var(--muted)',
    fontFamily: 'Nunito Sans, sans-serif',
    marginBottom: '12px',
  } as React.CSSProperties,

  li: {
    fontSize: '15px',
    lineHeight: 1.8,
    color: 'var(--muted)',
    fontFamily: 'Nunito Sans, sans-serif',
    marginBottom: '6px',
  } as React.CSSProperties,

  inlineCode: {
    background: 'var(--surface2)',
    padding: '2px 6px',
    borderRadius: '6px',
    fontFamily: '"Fira Code", Consolas, monospace',
    fontSize: '13px',
    color: 'var(--text)',
  } as React.CSSProperties,

  tag: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'Nunito, sans-serif',
  } as React.CSSProperties,

  divider: {
    border: 'none',
    borderTop: '2px solid var(--border)',
    margin: '48px 0',
  } as React.CSSProperties,
};

/* ─────────────────────────────────────────────
   Sub-component: Sample Block
   ───────────────────────────────────────────── */

interface SampleProps {
  num: number;
  title: string;
  description: string;
  tags: string[];
  html: string;
  iframeTitle: string;
  iframeBg?: string;
}

const Sample: React.FC<SampleProps> = ({ num, title, description, tags, html, iframeTitle, iframeBg = '#fff' }) => (
  <section style={{ marginBottom: '16px' }}>
    {/* Badge + title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <span
        style={{
          ...s.tag,
          background: 'var(--accent)',
          color: '#fff',
          fontSize: '13px',
          padding: '4px 14px',
        }}
      >
        {num}
      </span>
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 800,
          fontFamily: 'Nunito, sans-serif',
          color: 'var(--text)',
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>

    {/* Description */}
    <p style={{ ...s.p, marginBottom: '14px' }}>{description}</p>

    {/* Tag chips */}
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            ...s.tag,
            background: 'var(--surface2)',
            color: 'var(--muted)',
            border: '1.5px solid var(--border)',
          }}
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Live preview */}
    <div
      style={{
        border: '2px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: iframeBg,
      }}
    >
      <iframe
        srcDoc={html}
        style={{ width: '100%', height: '400px', border: 'none', borderRadius: '16px', display: 'block' }}
        sandbox="allow-scripts"
        title={iframeTitle}
      />
    </div>

    {/* CodeBlock */}
    <CodeBlock code={html} language="html" />
  </section>
);

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */

export const FloatingButtonPost: React.FC = () => {
  usePageTitle('플로팅 버튼 완벽 가이드 — WorkKit Blog');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <article
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: '48px 24px 64px',
          }}
        >
          {/* ── Header ── */}
          <header style={{ marginBottom: '36px' }}>
            {/* Breadcrumb */}
            <nav style={{ marginBottom: '18px' }}>
              <Link
                to="/blog"
                style={{
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                }}
              >
                블로그
              </Link>
              <span style={{ color: 'var(--border2)', margin: '0 6px', fontSize: '13px' }}>/</span>
              <span style={{ color: 'var(--accent)', fontSize: '13px', fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>
                UI 컴포넌트
              </span>
            </nav>

            {/* Tag chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {['UI', 'CSS', 'JavaScript', '플로팅 버튼'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    ...s.tag,
                    background: 'rgba(255,107,53,0.12)',
                    color: 'var(--accent)',
                    border: '1.5px solid rgba(255,107,53,0.25)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* H1 */}
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 900,
                fontFamily: 'Nunito, sans-serif',
                color: 'var(--text)',
                lineHeight: 1.35,
                marginBottom: '14px',
              }}
            >
              플로팅 버튼 완벽 가이드 + 4가지 스타일 샘플 코드
            </h1>

            {/* Date + reading time */}
            <p
              style={{
                fontSize: '13px',
                color: 'var(--muted)',
                fontFamily: 'Nunito Sans, sans-serif',
                marginBottom: '28px',
              }}
            >
              2025.01.15 · 읽는 시간 10분
            </p>

            {/* Hero emoji box */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))',
                border: '2px solid rgba(255,107,53,0.2)',
                borderRadius: '20px',
                padding: '40px 24px',
                textAlign: 'center',
                fontSize: '64px',
                lineHeight: 1,
              }}
            >
              💬
            </div>
          </header>

          {/* ── Section 1: 플로팅 버튼이란? ── */}
          <section>
            <h2 style={s.h2}>플로팅 버튼이란?</h2>
            <p style={s.p}>
              플로팅 버튼(FAB, Floating Action Button)은 화면의 특정 위치(보통 우측 하단)에 항상 떠 있는 버튼입니다.
              사용자가 페이지를 스크롤하더라도 항상 같은 위치에 고정되어 접근성이 뛰어납니다. 가장 흔하게 볼 수 있는
              예시는 고객 지원 채팅, AI 어시스턴트, 빠른 작성 버튼 등입니다.
            </p>
          </section>

          {/* ── Section 2: 어떨 때 사용하나요? ── */}
          <section>
            <h2 style={s.h2}>어떨 때 사용하나요?</h2>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px', listStyleType: 'disc' }}>
              <li style={s.li}>
                <strong style={{ color: 'var(--text)' }}>고객 지원 채팅</strong> — 사용자가 언제든지 문의할 수 있도록
              </li>
              <li style={s.li}>
                <strong style={{ color: 'var(--text)' }}>AI 어시스턴트</strong> — ChatGPT 스타일 AI와의 빠른 소통
              </li>
              <li style={s.li}>
                <strong style={{ color: 'var(--text)' }}>빠른 액션</strong> — 글쓰기, 업로드 등 자주 쓰는 기능 접근
              </li>
              <li style={s.li}>
                <strong style={{ color: 'var(--text)' }}>소셜/공유</strong> — SNS 공유, 친구 초대 등
              </li>
              <li style={s.li}>
                <strong style={{ color: 'var(--text)' }}>스크롤 상단 이동</strong> — 긴 페이지의 TOP 버튼
              </li>
            </ul>
          </section>

          {/* ── Section 3: CSS 핵심 구현 방법 ── */}
          <section>
            <h2 style={s.h2}>CSS 핵심 구현 방법</h2>
            <div
              style={{
                background: '#1e1e2e',
                color: '#cdd6f4',
                borderRadius: '14px',
                padding: '20px 24px',
                fontFamily: '"Fira Code", Consolas, monospace',
                fontSize: '13px',
                lineHeight: 1.7,
                marginBottom: '14px',
                border: '2px solid rgba(255,255,255,0.05)',
                overflowX: 'auto',
              }}
            >
              <pre style={{ margin: 0 }}>{`/* 기본 구조 */
.fab-wrapper {
  position: fixed;   /* 화면에 고정 */
  bottom: 32px;      /* 아래에서 32px */
  right: 32px;       /* 오른쪽에서 32px */
  z-index: 100;      /* 다른 요소 위에 표시 */
}`}</pre>
            </div>
            <p style={s.p}>
              <code style={s.inlineCode}>position: fixed</code>가 핵심입니다. 이 속성 덕분에 스크롤과 무관하게 항상 같은
              위치에 고정됩니다.
            </p>
          </section>

          {/* ── Samples Section ── */}
          <section style={{ marginTop: '48px' }}>
            <h2 style={{ ...s.h2, marginTop: '0', fontSize: '22px' }}>
              4가지 스타일 샘플 — 직접 체험해 보세요!
            </h2>
            <p style={{ ...s.p, marginBottom: '36px' }}>
              아래 미리보기에서 버튼을 직접 클릭해 작동을 확인하고, 코드를 복사해 사용하세요.
            </p>

            {/* Sample 1 */}
            <Sample
              num={1}
              title="AI Neural Style"
              description="SF 감성의 AI 어시스턴트 버튼. 파란 글로우 효과와 펄스 애니메이션이 특징입니다. 테크 스타트업, AI 서비스, SaaS 대시보드에 어울립니다."
              tags={['SF 감성', '다크 테마', '파란 글로우', '펄스 애니메이션']}
              html={HTML_AI_NEURAL}
              iframeTitle="AI Neural 플로팅 버튼 미리보기"
              iframeBg="#080c14"
            />

            <hr style={s.divider} />

            {/* Sample 2 */}
            <Sample
              num={2}
              title="Digital Cyberpunk"
              description="핑크&시안 사이버펑크 스타일. 육각형 버튼과 글리치 효과가 인상적입니다. 게임 관련 서비스, 테크 커뮤니티, 창작 플랫폼에 어울립니다."
              tags={['사이버펑크', '핑크 글로우', '육각형', '글리치']}
              html={HTML_CYBERPUNK}
              iframeTitle="Digital Cyberpunk 플로팅 버튼 미리보기"
              iframeBg="#0a0010"
            />

            <hr style={s.divider} />

            {/* Sample 3 */}
            <Sample
              num={3}
              title="Support Chat (고객센터 스타일)"
              description="전문적인 고객 지원 채팅 UI. 읽지 않은 메시지 배지, 상담사 온라인 표시, 빠른 질문 버튼이 포함되어 있습니다. 쇼핑몰, B2B SaaS, 기업 홈페이지에 적합합니다."
              tags={['고객센터', '프로페셔널', '블루', '배지']}
              html={HTML_SUPPORT}
              iframeTitle="Support Chat 플로팅 버튼 미리보기"
              iframeBg="#f0f4f8"
            />

            <hr style={s.divider} />

            {/* Sample 4 */}
            <Sample
              num={4}
              title="Cute Cat 🐱"
              description="귀엽고 사랑스러운 고양이 캐릭터 버튼. 플로팅 도트 애니메이션과 핑크 컬러 팔레트가 특징입니다. 펫샵, 뷰티, 라이프스타일 브랜드에 어울립니다."
              tags={['귀여움', '핑크', '고양이', '캐릭터']}
              html={HTML_CUTE_CAT}
              iframeTitle="Cute Cat 플로팅 버튼 미리보기"
              iframeBg="#fff0f6"
            />
          </section>

          {/* ── Article Footer ── */}
          <section style={{ marginTop: '56px' }}>
            <hr style={s.divider} />

            <h2 style={s.h2}>마무리</h2>
            <p style={s.p}>
              플로팅 버튼은 사용자 경험을 크게 향상시키는 UI 요소입니다. 위 4가지 스타일 중 마음에 드는 것을 골라 HTML
              파일로 저장한 뒤, 여러분의 프로젝트에{' '}
              <code style={s.inlineCode}>&lt;script&gt;</code>,{' '}
              <code style={s.inlineCode}>&lt;style&gt;</code>, 버튼 HTML을 각각 복사해서 붙여넣으면 됩니다.
            </p>
            <p style={s.p}>
              스타일만 바꾸면 브랜드에 맞는 나만의 플로팅 버튼을 쉽게 만들 수 있습니다. 색상, 아이콘, 팝업 내용은 자유롭게
              커스터마이징하세요!
            </p>

            <div
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                borderRadius: '16px',
                padding: '24px 28px',
                marginTop: '32px',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  fontFamily: 'Nunito, sans-serif',
                  color: 'var(--text)',
                  marginBottom: '14px',
                }}
              >
                더 읽을거리
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <Link
                    to="/blog"
                    style={{
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    ← 블로그 목록으로 돌아가기
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    style={{
                      color: 'var(--muted)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    🧩 다른 UI 컴포넌트 가이드 보기
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};
