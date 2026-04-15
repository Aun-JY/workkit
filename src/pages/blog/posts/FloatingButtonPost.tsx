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
<title>Digital Style Chat</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Outfit', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zM0 50l28 16 28-16' fill='none' stroke='rgba(255,0,128,0.05)' stroke-width='1'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0;
  }

  .page-content {
    position: relative; z-index: 1;
    padding: 48px;
  }

  .glitch {
    font-family: 'Share Tech Mono', monospace;
    font-size: 32px;
    color: #ff0080;
    position: relative;
    display: inline-block;
  }

  .glitch::before, .glitch::after {
    content: attr(data-text);
    position: absolute; top: 0; left: 0;
    width: 100%;
  }
  .glitch::before { color: #00ffff; clip-path: inset(0 0 60% 0); animation: glitch1 2s infinite; }
  .glitch::after  { color: #ff0080; clip-path: inset(60% 0 0 0); animation: glitch2 2s infinite; }

  @keyframes glitch1 {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-2px, 1px); }
    94% { transform: translate(2px, -1px); }
  }
  @keyframes glitch2 {
    0%, 88%, 100% { transform: translate(0); }
    90% { transform: translate(2px, 1px); }
    92% { transform: translate(-2px, -1px); }
  }

  .page-sub {
    font-size: 12px; color: rgba(255,0,128,0.4);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 2px; margin-top: 8px;
  }

  .fab-wrapper {
    position: fixed;
    bottom: 32px; right: 32px;
    z-index: 100;
  }

  .fab-btn {
    width: 64px; height: 64px;
    background: none; border: none;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s;
  }
  .fab-btn:hover { transform: scale(1.08) rotate(5deg); }
  .fab-btn:active { transform: scale(0.95); }

  .fab-ring {
    position: absolute; inset: 0;
    animation: spin 8s linear infinite;
  }
  .fab-btn:hover .fab-ring { animation-duration: 2s; }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .chat-popup {
    position: fixed;
    bottom: 112px; right: 32px;
    width: 340px;
    background: rgba(8,8,15,0.96);
    border: 1px solid rgba(255,0,128,0.25);
    border-radius: 4px;
    overflow: hidden;
    transform-origin: bottom right;
    transform: scale(0.85) translateY(20px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.22s cubic-bezier(.4,0,.2,1);
    z-index: 99;
    backdrop-filter: blur(16px);
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }

  .chat-popup.open {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .chat-popup::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 16px; height: 16px;
    background: #ff0080;
    clip-path: polygon(0 0, 100% 100%, 100% 0);
  }

  .chat-popup::after {
    content: '';
    position: absolute; bottom: 0; left: 0;
    width: 16px; height: 16px;
    background: #ff0080;
    clip-path: polygon(0 0, 0 100%, 100% 100%);
    opacity: 0.6;
  }

  .chat-header {
    background: rgba(255,0,128,0.08);
    border-bottom: 1px solid rgba(255,0,128,0.2);
    padding: 14px 16px;
    display: flex; align-items: center; gap: 10px;
  }

  .hx-avatar {
    width: 32px; height: 32px;
    background: rgba(255,0,128,0.12);
    border: 1px solid rgba(255,0,128,0.4);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .header-info { flex: 1; }
  .hname {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; color: #ff0080; font-weight: 700;
    letter-spacing: 1px;
  }
  .hsub {
    font-size: 10px; color: rgba(0,255,255,0.5);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 0.5px;
  }

  .close-x {
    background: none; border: 1px solid rgba(255,0,128,0.2);
    width: 24px; height: 24px;
    cursor: pointer; color: rgba(255,0,128,0.5);
    font-size: 12px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .close-x:hover { background: rgba(255,0,128,0.15); color: #ff0080; }

  .sys-bar {
    height: 2px;
    background: linear-gradient(90deg, #ff0080, #00ffff, #ff0080);
    background-size: 200% 100%;
    animation: bar-shift 2s linear infinite;
  }
  @keyframes bar-shift { 0% { background-position: 0; } 100% { background-position: 200%; } }

  .chat-messages {
    padding: 16px 14px 10px;
    min-height: 140px;
    display: flex; flex-direction: column; gap: 12px;
  }

  .greeting {
    padding: 20px 4px 8px;
    display: flex; flex-direction: column; gap: 8px;
  }

  .g-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: rgba(0,255,255,0.6);
    letter-spacing: 1px;
  }
  .g-tag::before {
    content: '▶'; font-size: 8px; color: #ff0080;
  }

  .g-title {
    font-family: 'Share Tech Mono', monospace;
    font-size: 18px; color: #ff0080;
    line-height: 1.2;
  }

  .g-sub {
    font-size: 12px; color: rgba(255,255,255,0.45);
    line-height: 1.6;
  }

  .msg { display: flex; gap: 8px; align-items: flex-end; }
  .msg.user { flex-direction: row-reverse; }

  .bubble {
    max-width: 210px;
    font-size: 13px; line-height: 1.55;
    padding: 8px 12px;
  }

  .msg.bot .bubble {
    background: rgba(0,255,255,0.06);
    border: 1px solid rgba(0,255,255,0.15);
    border-left: 2px solid #00ffff;
    color: rgba(255,255,255,0.8);
    border-radius: 0 8px 8px 0;
  }

  .msg.user .bubble {
    background: rgba(255,0,128,0.1);
    border: 1px solid rgba(255,0,128,0.25);
    border-right: 2px solid #ff0080;
    color: rgba(255,200,220,0.9);
    border-radius: 8px 0 0 8px;
  }

  .chat-input-row {
    border-top: 1px solid rgba(255,0,128,0.15);
    padding: 10px 12px;
    display: flex; gap: 8px; align-items: center;
  }

  .chat-input {
    flex: 1;
    background: rgba(255,0,128,0.04);
    border: 1px solid rgba(255,0,128,0.2);
    border-radius: 2px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: 'Share Tech Mono', monospace;
    color: rgba(255,255,255,0.8);
    outline: none;
    transition: border-color 0.2s;
  }
  .chat-input::placeholder { color: rgba(255,0,128,0.3); }
  .chat-input:focus { border-color: rgba(255,0,128,0.5); }

  .send-btn {
    width: 34px; height: 32px;
    background: rgba(255,0,128,0.12);
    border: 1px solid rgba(255,0,128,0.3);
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
    border-radius: 0;
  }
  .send-btn:hover { background: rgba(255,0,128,0.25); }

  .powered {
    text-align: center; padding: 6px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; color: rgba(255,0,128,0.2);
    letter-spacing: 2px;
  }
</style>
</head>
<body>

<div class="page-content">
  <div class="glitch" data-text="DIGITAL">DIGITAL</div>
  <div class="page-sub">// CHAT_MODULE ACTIVE &lt;v3.7.2&gt;</div>
</div>

<div class="chat-popup" id="popup">
  <div class="sys-bar"></div>
  <div class="chat-header">
    <div class="hx-avatar">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#ff0080" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="header-info">
      <div class="hname">SYS_CHAT</div>
      <div class="hsub">&lt;CONNECTED&gt; 0ms LATENCY</div>
    </div>
    <button class="close-x" id="closeBtn">✕</button>
  </div>

  <div class="chat-messages">
    <div class="greeting">
      <div class="g-tag">SYSTEM READY</div>
      <div class="g-title">접속<br>완료.</div>
      <div class="g-sub">무엇이든 입력하세요.<br>실시간으로 처리합니다.</div>
    </div>
  </div>

  <div class="chat-input-row">
    <input class="chat-input" placeholder="INPUT://" id="msgInput"/>
    <button class="send-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="#ff0080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
  <div class="powered">DIGITAL_ENGINE © 2025</div>
</div>

<div class="fab-wrapper">
  <button class="fab-btn" id="fabBtn">
    <svg class="fab-ring" width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" stroke="rgba(255,0,128,0.3)" stroke-width="1" stroke-dasharray="4 6"/>
    </svg>
    <svg style="position:absolute;inset:0;" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="rgba(10,8,15,0.95)" stroke="url(#dGrad)" stroke-width="1.5"/>
      <polygon points="32,12 50,22 50,42 32,52 14,42 14,22" fill="rgba(255,0,128,0.06)" stroke="rgba(255,0,128,0.2)" stroke-width="1"/>
      <path d="M35 20l-8 14h7l-3 10 9-14h-7l2-10z" fill="#ff0080" opacity="0.9"/>
      <circle cx="32" cy="4" r="2" fill="#ff0080"/>
      <circle cx="56" cy="18" r="2" fill="#00ffff" opacity="0.7"/>
      <circle cx="56" cy="46" r="2" fill="#ff0080" opacity="0.5"/>
      <defs>
        <linearGradient id="dGrad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stop-color="#ff0080"/>
          <stop offset="50%" stop-color="#00ffff"/>
          <stop offset="100%" stop-color="#ff0080"/>
        </linearGradient>
      </defs>
    </svg>
  </button>
</div>

<script>
const fab = document.getElementById('fabBtn');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('closeBtn');
let isOpen = false;

function toggle(open) {
  isOpen = open;
  popup.classList.toggle('open', open);
}

fab.addEventListener('click', () => toggle(!isOpen));
closeBtn.addEventListener('click', () => toggle(false));

document.getElementById('msgInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    const msgs = popup.querySelector('.chat-messages');
    msgs.innerHTML = '';
    const u = document.createElement('div');
    u.className = 'msg user';
    u.innerHTML = '<div class="bubble">' + e.target.value + '</div>';
    msgs.appendChild(u);
    e.target.value = '';
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'msg bot';
      b.innerHTML = '<div class="bubble">// PROCESSING... 응답을 생성하고 있습니다.</div>';
      msgs.appendChild(b);
    }, 600);
  }
});
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
<title>Cute Chat</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #fff8f5;
    min-height: 100vh;
    overflow: hidden;
  }

  .dot-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }

  .fdot {
    position: absolute;
    border-radius: 50%;
    opacity: 0.25;
    animation: float-dot linear infinite;
  }

  @keyframes float-dot {
    0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.25; }
    90% { opacity: 0.15; }
    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
  }

  .page-content {
    position: relative; z-index: 1;
    padding: 48px;
  }

  .page-title {
    font-size: 38px; font-weight: 800;
    color: #ff6b9d;
    line-height: 1.2;
  }

  .page-title span { color: #ffc2d1; }

  .page-sub {
    font-size: 14px; color: #ffb3c6;
    margin-top: 8px; font-weight: 600;
  }

  .sticker {
    position: absolute;
    font-size: 28px;
    animation: wobble 3s ease-in-out infinite;
    user-select: none;
  }
  @keyframes wobble {
    0%, 100% { transform: rotate(-5deg) scale(1); }
    50% { transform: rotate(5deg) scale(1.1); }
  }

  .fab-wrapper {
    position: fixed;
    bottom: 32px; right: 32px;
    z-index: 100;
  }

  .fab-btn {
    width: 66px; height: 66px;
    background: none; border: none;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
  }
  .fab-btn:hover { transform: scale(1.12) rotate(-5deg); }
  .fab-btn:active { transform: scale(0.95); }

  .chat-popup {
    position: fixed;
    bottom: 114px; right: 28px;
    width: 320px;
    background: #fffbfd;
    border: 2px solid #ffd6e7;
    border-radius: 28px;
    overflow: hidden;
    transform-origin: bottom right;
    transform: scale(0.8) translateY(20px) rotate(2deg);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
    z-index: 99;
  }

  .chat-popup.open {
    transform: scale(1) translateY(0) rotate(0deg);
    opacity: 1;
    pointer-events: all;
  }

  .chat-header {
    background: linear-gradient(135deg, #ff6b9d, #ff8fab, #ffb3c6);
    padding: 16px 18px 14px;
    position: relative;
    overflow: hidden;
  }

  .spark {
    position: absolute;
    color: rgba(255,255,255,0.6);
    font-size: 12px;
    animation: sparkle 2s ease-in-out infinite;
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1); }
  }

  .header-row {
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 1;
  }

  .cute-avatar {
    width: 42px; height: 42px;
    border-radius: 50%;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    border: 2.5px solid rgba(255,255,255,0.6);
    box-shadow: 0 3px 12px rgba(255,107,157,0.3);
    animation: bounce-av 2s ease-in-out infinite;
  }

  @keyframes bounce-av {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }

  .header-info { flex: 1; }

  .cute-name {
    font-size: 14px; font-weight: 800;
    color: #fff; letter-spacing: 0.2px;
  }

  .cute-status {
    font-size: 11px; color: rgba(255,255,255,0.8);
    font-weight: 600;
  }

  .close-btn {
    background: rgba(255,255,255,0.25);
    border: none;
    width: 26px; height: 26px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
    font-weight: 700;
  }
  .close-btn:hover { background: rgba(255,255,255,0.4); }

  .mood-strip {
    padding: 8px 14px;
    background: #fff0f6;
    border-bottom: 1.5px solid #ffd6e7;
    display: flex; gap: 6px; align-items: center;
  }
  .mood-label {
    font-size: 10px; color: #ffb3c6; font-weight: 700;
    letter-spacing: 0.3px;
  }
  .mood-btn {
    background: none; border: 1.5px solid #ffd6e7;
    border-radius: 20px; padding: 3px 8px;
    font-size: 11px; color: #ff6b9d; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
  }
  .mood-btn:hover { background: #ffd6e7; }
  .mood-btn.active { background: #ff6b9d; color: #fff; border-color: #ff6b9d; }

  .chat-messages {
    padding: 14px 14px 8px;
    min-height: 140px;
    display: flex; flex-direction: column; gap: 10px;
  }

  .greeting-area {
    display: flex; flex-direction: column; align-items: center;
    padding: 10px 0 4px;
    text-align: center; gap: 8px;
  }

  .emoji-big { font-size: 40px; animation: bounce-av 1.5s ease-in-out infinite; }

  .greet-title {
    font-size: 16px; font-weight: 800;
    color: #ff6b9d;
  }

  .greet-sub {
    font-size: 12px; color: #ffb3c6;
    line-height: 1.65; font-weight: 600;
  }

  .quick-pills {
    display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;
    margin-top: 4px;
  }

  .pill {
    background: #fff0f6;
    border: 1.5px solid #ffd6e7;
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px; font-weight: 700;
    color: #ff6b9d;
    cursor: pointer; transition: all 0.15s;
  }
  .pill:hover { background: #ffd6e7; transform: scale(1.05); }

  .msg { display: flex; gap: 8px; align-items: flex-end; }
  .msg.user { flex-direction: row-reverse; }

  .bubble {
    max-width: 200px;
    font-size: 13px; line-height: 1.55;
    padding: 9px 13px;
    font-weight: 600;
  }

  .msg.bot .bubble {
    background: #fff0f6;
    border: 1.5px solid #ffd6e7;
    color: #e75480;
    border-radius: 4px 18px 18px 18px;
  }

  .msg.user .bubble {
    background: linear-gradient(135deg, #ff6b9d, #ff8fab);
    color: #fff;
    border-radius: 18px 4px 18px 18px;
  }

  .chat-input-row {
    border-top: 1.5px solid #ffd6e7;
    padding: 10px 12px;
    display: flex; gap: 8px; align-items: center;
    background: #fff8fb;
  }

  .emoji-pick {
    background: none; border: none; cursor: pointer;
    font-size: 18px; padding: 2px;
    transition: transform 0.15s;
  }
  .emoji-pick:hover { transform: scale(1.2) rotate(10deg); }

  .chat-input {
    flex: 1;
    background: #fff0f6;
    border: 1.5px solid #ffd6e7;
    border-radius: 20px;
    padding: 8px 14px;
    font-size: 12px;
    font-family: 'Nunito', sans-serif;
    font-weight: 600;
    color: #e75480;
    outline: none;
    transition: border-color 0.2s;
  }
  .chat-input::placeholder { color: #ffb3c6; }
  .chat-input:focus { border-color: #ff8fab; }

  .send-btn {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b9d, #ff8fab);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s;
    font-size: 16px;
  }
  .send-btn:hover { transform: scale(1.1) rotate(-10deg); }
  .send-btn:active { transform: scale(0.9); }

  .footer-cute {
    text-align: center; padding: 5px 0 8px;
    font-size: 10px; color: #ffb3c6; font-weight: 700;
    letter-spacing: 0.3px;
  }
</style>
</head>
<body>

<div class="dot-bg" id="dotBg"></div>

<div class="page-content">
  <div style="position:relative; display:inline-block;">
    <div class="sticker" style="top:-10px; left:-20px; animation-delay:0s;">🌸</div>
    <div class="sticker" style="top:-5px; left:200px; animation-delay:0.8s; font-size:20px;">✨</div>
  </div>
  <div class="page-title">안녕하세요<span>~</span><br>🐱 하울이에요!</div>
  <div class="page-sub">✨ 언제든지 말 걸어주세요 ✨</div>
</div>

<div class="chat-popup" id="popup">
  <div class="chat-header">
    <div class="spark" style="top:8px; right:40px; animation-delay:0s;">✦</div>
    <div class="spark" style="bottom:6px; left:50px; animation-delay:0.7s;">✧</div>
    <div class="spark" style="top:6px; left:100px; animation-delay:1.4s; font-size:8px;">✦</div>
    <div class="header-row">
      <div class="cute-avatar">🐱</div>
      <div class="header-info">
        <div class="cute-name">하울이 🎀</div>
        <div class="cute-status">💕 지금 바로 도와드릴게요~</div>
      </div>
      <button class="close-btn" id="closeBtn">✕</button>
    </div>
  </div>

  <div class="mood-strip">
    <span class="mood-label">기분</span>
    <button class="mood-btn active">😊 좋음</button>
    <button class="mood-btn">😕 도움필요</button>
    <button class="mood-btn">🤩 신남</button>
  </div>

  <div class="chat-messages" id="chatMsgs">
    <div class="greeting-area">
      <div class="emoji-big">🐾</div>
      <div class="greet-title">반가워요! 🌟</div>
      <div class="greet-sub">하울이가 도와드릴게요~<br>무엇이 궁금하신가요?</div>
      <div class="quick-pills">
        <button class="pill">🛍️ 쇼핑 도움</button>
        <button class="pill">💌 문의하기</button>
        <button class="pill">🎁 이벤트</button>
        <button class="pill">❓ 기타</button>
      </div>
    </div>
  </div>

  <div class="chat-input-row">
    <button class="emoji-pick">🌸</button>
    <input class="chat-input" placeholder="메시지를 입력해주세요~" id="msgInput"/>
    <button class="send-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
  <div class="footer-cute">🌸 하울이와 함께해요 🌸</div>
</div>

<div class="fab-wrapper">
  <button class="fab-btn" id="fabBtn">
    <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="33" cy="36" rx="25" ry="8" fill="rgba(255,107,157,0.2)"/>
      <rect x="5" y="5" width="56" height="56" rx="20" fill="url(#cuteGrad)"/>
      <rect x="10" y="10" width="46" height="46" rx="16" fill="rgba(255,255,255,0.12)"/>
      <circle cx="33" cy="34" r="14" fill="white" opacity="0.95"/>
      <polygon points="23,22 19,14 27,20" fill="white" opacity="0.95"/>
      <polygon points="43,22 47,14 39,20" fill="white" opacity="0.95"/>
      <polygon points="23,21 21,16 26,20" fill="#ffb3c6" opacity="0.8"/>
      <polygon points="43,21 45,16 40,20" fill="#ffb3c6" opacity="0.8"/>
      <ellipse cx="28" cy="32" rx="3" ry="3.5" fill="#ff6b9d"/>
      <ellipse cx="38" cy="32" rx="3" ry="3.5" fill="#ff6b9d"/>
      <ellipse cx="27.5" cy="31.5" rx="1.2" ry="1.5" fill="white"/>
      <ellipse cx="37.5" cy="31.5" rx="1.2" ry="1.5" fill="white"/>
      <ellipse cx="33" cy="37" rx="2" ry="1.4" fill="#ffb3c6"/>
      <path d="M29 39.5 Q33 42 37 39.5" stroke="#ffb3c6" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <line x1="20" y1="36" x2="27" y2="37" stroke="#ffb3c6" stroke-width="0.8" opacity="0.7"/>
      <line x1="20" y1="38.5" x2="27" y2="38.5" stroke="#ffb3c6" stroke-width="0.8" opacity="0.7"/>
      <line x1="39" y1="37" x2="46" y2="36" stroke="#ffb3c6" stroke-width="0.8" opacity="0.7"/>
      <line x1="39" y1="38.5" x2="46" y2="38.5" stroke="#ffb3c6" stroke-width="0.8" opacity="0.7"/>
      <text x="8" y="16" font-size="9" opacity="0.7">♥</text>
      <text x="50" y="16" font-size="9" opacity="0.7">♥</text>
      <defs>
        <linearGradient id="cuteGrad" x1="5" y1="5" x2="61" y2="61">
          <stop offset="0%" stop-color="#ff6b9d"/>
          <stop offset="50%" stop-color="#ff8fab"/>
          <stop offset="100%" stop-color="#ffb3c6"/>
        </linearGradient>
      </defs>
    </svg>
  </button>
</div>

<script>
const fab = document.getElementById('fabBtn');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('closeBtn');
let isOpen = false;

function toggle(open) {
  isOpen = open;
  popup.classList.toggle('open', open);
}

fab.addEventListener('click', () => toggle(!isOpen));
closeBtn.addEventListener('click', () => toggle(false));

const dotBg = document.getElementById('dotBg');
const colors = ['#ff6b9d','#ffb3c6','#ffd6e7','#ff8fab','#ffc2d1'];
for (let i = 0; i < 14; i++) {
  const d = document.createElement('div');
  d.className = 'fdot';
  const size = 6 + Math.random() * 12;
  d.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(Math.random()*100)+'%;background:'+colors[Math.floor(Math.random()*colors.length)]+';animation-duration:'+(8+Math.random()*10)+'s;animation-delay:'+(Math.random()*8)+'s;';
  dotBg.appendChild(d);
}

document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

document.getElementById('msgInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.trim()) {
    const msgs = document.getElementById('chatMsgs');
    const greet = msgs.querySelector('.greeting-area');
    if (greet) greet.remove();
    const u = document.createElement('div');
    u.className = 'msg user';
    u.innerHTML = '<div class="bubble">' + e.target.value + '</div>';
    msgs.appendChild(u);
    e.target.value = '';
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'msg bot';
      b.innerHTML = '<div class="bubble">냥~ 알겠어요! 🐾 잠깐만 기다려 주세요 💕</div>';
      msgs.appendChild(b);
    }, 500);
  }
});
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
        style={{ width: '100%', height: '560px', border: 'none', borderRadius: '16px', display: 'block' }}
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
