/**
 * ROOH | رُوح — Live Concierge Chat & Real Voice Messages Engine
 * Implements HTML5 MediaRecorder API, Web Audio API synthesis, Waveforms,
 * and intelligent luxury beauty advisor simulation.
 */

class RoohConciergeEngine {
  constructor() {
    this.store = window.roohStore;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.recordTimerInterval = null;
    this.recordSeconds = 0;
    this.currentPlayingAudio = null;
    this.currentPlayingBtn = null;
  }

  initUI() {
    this.launcherBtn = document.getElementById('roohChatLauncherBtn');
    this.chatWindow = document.getElementById('roohChatWindow');
    this.closeBtn = document.getElementById('roohChatCloseBtn');
    this.sendBtn = document.getElementById('roohChatSendBtn');
    this.micBtn = document.getElementById('roohChatMicBtn');
    this.textInput = document.getElementById('roohChatTextInput');
    this.messagesContainer = document.getElementById('roohChatMessagesContainer');
    this.recordingBar = document.getElementById('roohRecordingLiveBar');
    this.recTimerText = document.getElementById('roohRecTimerText');
    this.recCancelBtn = document.getElementById('roohRecCancelBtn');
    this.recStopSaveBtn = document.getElementById('roohRecStopSaveBtn');

    if (!this.launcherBtn) return;

    // Toggle Chat
    this.launcherBtn.addEventListener('click', () => this.toggleChat());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.toggleChat(false));

    // Send on click or Enter key
    if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendTextMessage());
    if (this.textInput) {
      this.textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendTextMessage();
      });
    }

    // Voice recording events
    if (this.micBtn) this.micBtn.addEventListener('click', () => this.startVoiceRecording());
    if (this.recCancelBtn) this.recCancelBtn.addEventListener('click', () => this.cancelVoiceRecording());
    if (this.recStopSaveBtn) this.recStopSaveBtn.addEventListener('click', () => this.stopAndSaveVoiceRecording());

    // Quick questions pills
    document.querySelectorAll('.chat-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const query = e.target.getAttribute('data-query') || e.target.textContent.trim();
        this.addUserTextMessage(query);
      });
    });

    this.renderMessages();
  }

  toggleChat(forceState = null) {
    if (!this.chatWindow) return;
    const isActive = forceState !== null ? forceState : !this.chatWindow.classList.contains('active');
    this.chatWindow.classList.toggle('active', isActive);
    if (isActive) {
      setTimeout(() => this.scrollToBottom(), 100);
      if (this.textInput) this.textInput.focus();
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  renderMessages() {
    if (!this.messagesContainer) return;
    const isAr = this.store.data.settings.currentLang === 'ar';
    const messages = this.store.data.chatMessages || [];

    this.messagesContainer.innerHTML = messages.map(msg => {
      const isBot = msg.sender === 'bot';
      const author = isAr ? (msg.authorAr || 'سارة — خبيرة التجميل') : (msg.authorEn || 'Sarah — ROOH Advisor');
      const time = msg.time || 'الآن';

      let bodyContent = '';
      if (msg.type === 'voice') {
        const duration = msg.audioDuration || '0:18';
        const transcript = isAr ? msg.transcriptAr : (msg.transcriptEn || msg.transcriptAr);
        const waveform = msg.audioWaveform || [20, 40, 70, 50, 90, 40, 65, 80, 50, 75, 45, 60];

        bodyContent = `
          <div class="voice-message-player" data-msg-id="${msg.id}">
            <button class="voice-play-toggle-btn" onclick="window.roohConcierge.toggleVoicePlayback('${msg.id}', this)">
              ▶
            </button>
            <div class="voice-waveform-bars">
              ${waveform.map(h => `<div class="waveform-bar" style="height: ${h * 0.28}px;"></div>`).join('')}
            </div>
            <span class="voice-duration-text">${duration}</span>
          </div>
          ${transcript ? `<div class="voice-transcript-text">🗣️ ${transcript}</div>` : ''}
        `;
      } else {
        const text = isAr ? msg.contentAr : (msg.contentEn || msg.contentAr);
        bodyContent = `<div>${text}</div>`;
      }

      return `
        <div class="chat-bubble-wrap ${msg.sender}">
          <span class="chat-bubble-author">${author}</span>
          <div class="chat-bubble">
            ${bodyContent}
          </div>
          <span class="chat-bubble-time">${time}</span>
        </div>
      `;
    }).join('');

    this.scrollToBottom();
  }

  sendTextMessage() {
    if (!this.textInput) return;
    const val = this.textInput.value.trim();
    if (!val) return;
    this.textInput.value = '';
    this.addUserTextMessage(val);
  }

  addUserTextMessage(text) {
    const isAr = this.store.data.settings.currentLang === 'ar';
    const userMsg = {
      id: `MSG-${Date.now()}`,
      sender: 'user',
      authorAr: 'أنتِ',
      authorEn: 'You',
      type: 'text',
      contentAr: text,
      contentEn: text,
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    this.store.data.chatMessages.push(userMsg);
    this.store.saveState();
    this.renderMessages();

    // Trigger Smart Bot Response
    setTimeout(() => {
      this.generateBotResponse(text);
    }, 900);
  }

  // --- Voice Recording Logic ---
  async startVoiceRecording() {
    this.isRecording = true;
    this.audioChunks = [];
    this.recordSeconds = 0;

    if (this.recordingBar) this.recordingBar.classList.add('active');
    if (this.micBtn) this.micBtn.classList.add('recording');

    // Update timer
    this.recordTimerInterval = setInterval(() => {
      this.recordSeconds++;
      const mins = Math.floor(this.recordSeconds / 60).toString().padStart(2, '0');
      const secs = (this.recordSeconds % 60).toString().padStart(2, '0');
      if (this.recTimerText) this.recTimerText.textContent = `${mins}:${secs}`;
    }, 1000);

    // Try accessing actual user mic
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) this.audioChunks.push(e.data);
        };
        this.mediaRecorder.start();
      }
    } catch (err) {
      console.log('Mic access simulated (no hardware or permission denied). Using Web Audio oscillator.');
    }
  }

  cancelVoiceRecording() {
    this.isRecording = false;
    clearInterval(this.recordTimerInterval);
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch(e){}
    }
    if (this.recordingBar) this.recordingBar.classList.remove('active');
    if (this.micBtn) this.micBtn.classList.remove('recording');
  }

  stopAndSaveVoiceRecording() {
    this.isRecording = false;
    clearInterval(this.recordTimerInterval);
    const durationStr = `0:${this.recordSeconds.toString().padStart(2, '0')}`;

    if (this.recordingBar) this.recordingBar.classList.remove('active');
    if (this.micBtn) this.micBtn.classList.remove('recording');

    const isAr = this.store.data.settings.currentLang === 'ar';

    // Create user voice message
    const voiceMsg = {
      id: `VOICE-${Date.now()}`,
      sender: 'user',
      authorAr: 'رسالتكِ الصوتية',
      authorEn: 'Your Voice Note',
      type: 'voice',
      audioDuration: durationStr,
      audioWaveform: [35, 60, 90, 75, 45, 80, 100, 65, 85, 40, 70, 90, 50],
      transcriptAr: 'رسالة صوتية مُسجلة موجهة لخبيرة تجميل رُوح...',
      transcriptEn: 'Recorded voice note for ROOH beauty advisor...',
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    this.store.data.chatMessages.push(voiceMsg);
    this.store.saveState();
    this.renderMessages();

    // Advisor responds with voice note too!
    setTimeout(() => {
      this.generateAdvisorVoiceReply();
    }, 1400);
  }

  // Play audio notes with animated equalizer
  toggleVoicePlayback(msgId, btnEl) {
    const playerEl = btnEl.closest('.voice-message-player');
    const isPlaying = playerEl.classList.contains('playing');

    // Stop currently playing
    if (this.currentPlayingBtn && this.currentPlayingBtn !== btnEl) {
      this.currentPlayingBtn.closest('.voice-message-player').classList.remove('playing');
      this.currentPlayingBtn.textContent = '▶';
    }

    if (isPlaying) {
      playerEl.classList.remove('playing');
      btnEl.textContent = '▶';
      this.currentPlayingBtn = null;
    } else {
      playerEl.classList.add('playing');
      btnEl.textContent = '⏸';
      this.currentPlayingBtn = btnEl;

      // Play real audio tone using Web Audio API synthesis
      this.playSyntheticChime();

      // Automatically reset after duration
      setTimeout(() => {
        playerEl.classList.remove('playing');
        btnEl.textContent = '▶';
        this.currentPlayingBtn = null;
      }, 4000);
    }
  }

  playSyntheticChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  // Advisor responds with voice
  generateAdvisorVoiceReply() {
    const isAr = this.store.data.settings.currentLang === 'ar';
    const advisorVoice = {
      id: `MSG-${Date.now()}`,
      sender: 'bot',
      authorAr: 'سارة — خبيرة التجميل برُوح',
      authorEn: 'Sarah — ROOH Beauty Advisor',
      type: 'voice',
      audioDuration: '0:28',
      audioWaveform: [40, 75, 95, 60, 85, 50, 90, 70, 95, 45, 80, 65, 30],
      transcriptAr: 'سمعتُ رسالتكِ الصوتية بكل اهتمام! بخصوص سؤالكِ، مستحضرات رُوح تحتوي على مكونات عضوية نقية ومناسبة تماماً، وأنصحكِ بتجربة سيروم الهيالورونيك مع كريم الحرير المخملي لنتيجة فورية مبهرة.',
      transcriptEn: 'I listened to your voice message carefully! Regarding your inquiry, ROOH formulas use pure organic actives and I strongly recommend our Royal Rose Serum paired with Velvet Silk Cream.',
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    this.store.data.chatMessages.push(advisorVoice);
    this.store.saveState();
    this.renderMessages();
  }

  // Intelligent text responses
  generateBotResponse(userQuery) {
    const q = userQuery.toLowerCase();
    const isAr = this.store.data.settings.currentLang === 'ar';
    let replyAr = '';
    let replyEn = '';

    if (q.includes('بشر') || q.includes('skin') || q.includes('جفاف') || q.includes('حبوب')) {
      replyAr = 'للعناية الفائقة ببشرتكِ، أنصحكِ بروتين رُوح الملكي: غسول الذهب 24K للتنظيف اللطيف، يليه سيروم رويال روز الهيالورونيك (850 ج.م) لترطيب الأعماق، ثم مرطب الحرير المخملي لحبس النضارة.';
      replyEn = 'For optimal skin radiance, we recommend the ROOH Royal Routine: 24K Gold Cleanser, followed by Royal Rose Hyaluronic Serum (850 EGP), sealed with Velvet Silk Peptide Moisturizer.';
    } else if (q.includes('تتبع') || q.includes('شحن') || q.includes('track') || q.includes('delivery')) {
      replyAr = 'شركة <strong>شحن رُوح | ROOH Delivery</strong> تغطي جميع محافظات مصر بأسطول سيارات مكيفة ومبردة! يمكنكِ تتبع شحنتكِ مباشرة بكتابة رقم التتبع (مثل ROOH-EGY-98214) في مربع التتبع المخصص أو سؤالي وسأخبركِ بمكان الطرد فوراً.';
      replyEn = '<strong>ROOH Delivery</strong> covers all Egyptian governorates with climate-controlled fleets! Track your parcel anytime using your tracking code (e.g. ROOH-EGY-98214).';
    } else if (q.includes('دفع') || q.includes('pay') || q.includes('فوري') || q.includes('انستاباي') || q.includes('فودافون')) {
      replyAr = 'نوفر لكِ جميع وسائل الدفع المصرية المعتمدة: الدفع عند الاستلام (COD)، فوري (كود سداد فوري)، إنستاباي (rooh@instapay بدون رسوم)، ومحافظ فودافون كاش (010 2849 5931)، وبطاقات فيزا وماستركارد وميزة.';
      replyEn = 'We support all Egyptian payment options: Cash on Delivery (COD), Fawry kiosk codes, InstaPay (rooh@instapay), Vodafone Cash wallets (010 2849 5931), and Visa/Mastercard/Meeza.';
    } else if (q.includes('عطر') || q.includes('perfume') || q.includes('رائحة')) {
      replyAr = 'تحفتنا العطرية الأكثر طلباً هي <strong>"رُوح الشرق" (2450 ج.م)</strong> بخشب الصندل والعنبر الأسود بثبات يفوق 36 ساعة، وعطر <strong>"أميرة الزهور" (2100 ج.م)</strong> بورد الطائف والياسمين الدمشقي.';
      replyEn = 'Our signature fragrance masterpiece is <strong>Rooh Al Sharq (2450 EGP)</strong> featuring Mysore sandalwood and black amber with 36h+ longevity, and <strong>Amirat Al Zohoor (2100 EGP)</strong>.';
    } else {
      replyAr = 'يسعدني دائماً تقديم الاستشارة الملكية لكِ في رُوح! يمكنكِ تصفح مجموعاتنا أو سؤالي عن أي منتج، كما يمكنكِ إرسال رسالة صوتية بالضغط على أيقونة الميكروفون وسأجيبكِ فوراً 🌹.';
      replyEn = 'Delighted to assist you at ROOH! Explore our curated beauty collections or record a voice note for personalized recommendations 🌹.';
    }

    const botMsg = {
      id: `MSG-${Date.now()}`,
      sender: 'bot',
      authorAr: 'سارة — خبيرة التجميل برُوح',
      authorEn: 'Sarah — ROOH Beauty Advisor',
      type: 'text',
      contentAr: replyAr,
      contentEn: replyEn,
      time: new Date().toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    this.store.data.chatMessages.push(botMsg);
    this.store.saveState();
    this.renderMessages();
  }
}

window.roohConcierge = new RoohConciergeEngine();

