var AlarmClock = function(id) {
	var self = this,
		id = id || '';		

	self.config = {
		store: {
			hours: 'alarmH'+id,
			minutes: 'alarmM'+id
		},
		fields: {
			hours: 'h-val'+ id,
			minutes: 'm-val'+ id,
			setter: 'set-btn'+ id,
			reset: 'reset-btn'+ id,
			status: 'alarm-status'+ id
		},
		ptrnData: {
			'light':[
				{
					name:'brickwall',
					color:'#efefef'
				},{
					name: 'bgnoise_lg',
					color: '#F8F8F8'
				},{
					name: 'honey_im_subtle',
					color: '#D7D7D7'
				},{
					name: 'mochaGrunge',
					color: '#BCBCBC'
				},{
					name: 'notebook',
					color: '#DFDFDF'
				},{
					name: 'purty_wood',
					color: '#E8C289'
				},{
					name: 'retina_wood',
					color: '#E9D4B4'
				},{
					name: 'sandpaper',
					color: '#D8D6D0'
				},{
					name: 'seamless_paper_texture',
					color: '#E5E3DA'
				},{
					name: 'symphony',
					color: '#F6F6F6'
				},{
					name: 'tileable_wood_texture',
					color: '#F2DDC5'
				},{
					name: 'wild_oliva',
					color: '#848484'
				},{
					name: 'wood_pattern',
					color: '#F2CD9B'
				},{
					name: 'upfeathers',
					color: '#FAFAF7'
				},{
					name: 'swirl_pattern',
					color: '#FDFDFE'
				},{
					name: 'gold_scale',
					color: '#F5F5F2'
				}
			],
			'dark':[
				{
					name:'dark_wood',
					color: '#1D1C1C'
				},{
					name: 'debut_dark',
					color: '#858585'
				},{
					name: 'grey_wash_wall',
					color: '#6D6D6D'
				},{
					name: 'tweed',
					color: '#4F4F4F'
				},{
					name: 'wood_1',
					color: '#292928'
				},{
					name: 'vertical_cloth',
					color: '#25282E'
				},{
					name: 'nami',
					color: '#000001'
				},{
					name: 'black_scales',
					color: '#0F0F0F'
				}
			]
		},
		patternTypes: ['all', 'dark', 'light', 'wood'],
		patterns: {
			'all': [
				'brickwall',
				'bgnoise_lg',
				'dark_wood',
				'debut_dark',
				'grey_wash_wall',
				'honey_im_subtle',
				'mochaGrunge',
				'notebook',
				'purty_wood',
				'retina_wood',
				'sandpaper',
				'seamless_paper_texture',
				'symphony',
				'tileable_wood_texture',
				'tweed',
				'wild_oliva',
				'wood_1',
				'wood_pattern',
				'vertical_cloth',
				'upfeathers',
				'swirl_pattern',
				'nami',
				'gold_scale',
				'black_scales',
			],
			'dark': [
				'dark_wood',
				'debut_dark',
				'grey_wash_wall',
				'mochaGrunge',
				'tweed',
				'wild_oliva',
				'wood_1',
				'vertical_cloth',
				'nami',
				'black_scales'
			],
			'light': [
				'brickwall',
				'bgnoise_lg',
				'honey_im_subtle',
				'notebook',
				'sandpaper',
				'seamless_paper_texture',
				'symphony',
				'upfeathers',
				'swirl_pattern',
				'gold_scale'
			],
			'wood': [
				'dark_wood',
				'purty_wood',
				'retina_wood',
				'tileable_wood_texture',
				'wood_1',
				'wood_pattern'
			]
		},
		timeTypes: {
			night: 'dark',
			morning: 'light',
			day: 'wood',
			random: 'all'
		},
		audio: {
			player: 'player'+id,
			songs: 'ringtones'+id
		},
		alarmControls: {
			ok: 'albtn-ok'+id,
			cancel: 'albtn-cancel'+id,
			status: 'alarm-status'+id,
			statusBox: 'alarm-status-box'+id
		}
	},

	self.init = function(){
		self.watches = setInterval(self.UI.showTime, 1000);		
		self.alarm.checkSaved();
		self.alarm.setFromHash();
		console.log('setType:', self.pattern.setType())
		self.pattern.set();
		self.UI.showDate();
		self.UI.showTime();
		self.UI.updateStatus();
	},

	self.pattern = {
		setType: function(way){
			switch(way) {
				case 'time':
				default:
					var h = new Date().getHours();
					return (h > 7 && h <= 17) ? 'light' : 'dark';
			}

		},
		type: '',
		check: function(time){
			if (time.m.charAt(1) === '0' && time.s === '00') this.update();
		},
		update: function(way){
			this.type = this.getType(way);
			this.set();
		},
		get: function(way){
			var type, pattern;

			if (typeof way === 'Object') {
				type = way['type'];
				pattern = way['pattern'];
			} else {
				type = this.type = this.getType(way);
				pattern = self.getRandom(self.config.patterns[type].length);
			}

			return self.config.patterns[type][pattern];
		},
		set: function(way){
			var pattern = this.get(way);
			document.body.style.background = 'url(patterns/' + pattern + '.png)';
			document.body.className = (self.config.patterns.dark.indexOf(pattern) < 0) ? 'light' : 'dark';
		},
		getType: function(way){
			if (typeof way === 'Object') {
				return self.config.patternTypes[way['type']];
			} else if (way === 'random') {
				return self.config.patternTypes[self.getRandom(self.config.patternTypes.length)];
			} else {
				var today = new Date(),
					h = today.getHours();

				if (h > 0 && h <= 7 || h > 17) {
					return self.config.timeTypes.night;
				} else if (h > 7 && h <= 13) {
					return self.config.timeTypes.morning;
				} else if (h > 13 && h <= 17) {
					return self.config.timeTypes.day;
				}
			}
		}
	},

	self.alarm = {
		save: function(h,m){
			localStorage.setItem(self.config.store.hours, h);
			localStorage.setItem(self.config.store.minutes, m);
		},
		checkSaved: function(){
			return Boolean(localStorage.getItem(self.config.store.hours) && localStorage.getItem(self.config.store.minutes));
		},
		setFromHash: function(){
			if (window.location.hash){
				var t = window.location.hash.replace('#','').split(':'),
					h = parseInt(t[0]),
					m = parseInt(t[1]);

				if (typeof h === 'number' && typeof m === 'number') {
					if (h<0 || h>23) return;
					if (m<0 || m>59) return;

					h = ((''+h).length<2) ? '0'+h : h;
					m = ((''+m).length<2) ? '0'+m : m;
					
					self.alarm.save(h, m);
                    self.player.play();
                    self.player.pause();
					self.UI.updateStatus();
				}
				
			}
		},
		clear: function(){
			localStorage.setItem(self.config.store.hours, '');
			localStorage.setItem(self.config.store.minutes, '');
		},
		get: function(){
			return {
				h: localStorage.getItem(self.config.store.hours), 
				m: localStorage.getItem(self.config.store.minutes)
			}
		},
		check: function(time){
			var alarm = this.get();

			if (alarm.h && alarm.m) {
				var time = self.UI.updateTime();
				if (time.h == alarm.h && time.m == alarm.m) this.show(alarm);
			}
		},
		show: function(alarm){
			self.player.play();
			self.alarmStatBox.className += ' alarm-active';
			self.UI.updateTitle('Alarm!');
			
		},
		hide: function(){
			self.UI.updateStatus();
			self.alarm.stopMusic();

			var className = self.alarmStatBox.className;
			while(className.indexOf(' alarm-active') > 0) {
				className = className.replace(' alarm-active','')	
			}
			self.alarmStatBox.className = className;
		},
		addMinutes: function(minutes) {
			var date = new Date();
			return new Date(date.getTime() + minutes*60*1000);
		},
		snooze: function() {
			var snoozeTime = /*+prompt("Minutes for another snooze:", "10") || */10;
			
			var time = self.alarm.addMinutes(snoozeTime);

			self.alarm.save( self.UI.addSymbol(time.getHours()), self.UI.addSymbol(time.getMinutes()) );

			self.alarm.hide();			
		},
		setSong: function(){
			document.getElementById(self.config.audio.player+'-mp3-src').src = 'audio/' + self.songs.value + '.mp3';
			document.getElementById(self.config.audio.player+'-ogg-src').src = 'audio/' + self.songs.value + '.ogg';
			self.player.load();
			self.player.play();
			self.player.pause();
		},
		set: function(){
			self.alarm.save(self.UI.getValues().h, self.UI.getValues().m);
            self.player.play();
            self.player.pause();
			self.UI.clearFields();
			self.UI.updateStatus();			
		},
		reset: function(){
			self.alarm.clear();
			self.alarm.hide();
		},
		stopMusic: function(){
			self.player.pause();
			self.player.currentTime = 0;
		},
		checkExpired: function(h, m){
			var stored = Boolean(h && m) ? {h: h, m: m} : self.alarm.get(),
				current = self.UI.updateTime();

			console.log('stored:', stored);

			if (current.h > stored.h) return true;
			else if (current.h == stored.h) {
				return (current.m > stored.m);
			} else return false;
		}
	},

	self.UI = {
		clearFields: function(){
			document.getElementById(self.config.fields.hours).value = '';
			document.getElementById(self.config.fields.minutes).value = '';
		},
		updateStatus: function(){
			var alarm = self.alarm.get();

			var message = (self.alarm.checkSaved()) ? "Alarm is set to <strong>" + alarm.h + ":" + alarm.m + "</strong>." : "No alarm is set.";
			
			document.getElementById(self.config.fields.status).innerHTML = message;

			if (self.alarm.checkSaved()) self.UI.updateTitle('Alarm at ' + alarm.h + ':' + alarm.m);
			else self.UI.updateTitle(message);
		},
		getValues: function(){
			return {
				h: this.addSymbol(document.getElementById(self.config.fields.hours).value),
				m: this.addSymbol(document.getElementById(self.config.fields.minutes).value)
			}
		},
		addSymbol: function(value, symbol, size) {
			var size = size || 2,
				symbol = symbol || '0',
				value = '' + value;

			while (value.length < size) {
				value = symbol + value;
			}

			return value;
		},
		updateTime: function(){
			var today = new Date();
			return {
				h: this.addSymbol(today.getHours()),
				m: this.addSymbol(today.getMinutes()),
				s: this.addSymbol(today.getSeconds())
			}
		},
		inputTime: function(time){
			document.getElementById('cell-h').innerHTML = time.h;
			document.getElementById('cell-m').innerHTML = time.m;
			document.getElementById('cell-s').innerHTML = time.s;			
		},
		showDate: function(){
			var date = new Date(),
				d = date.getDate(),
				w = ['Sunday','Monday','Tuesday','Wednesday', 'Thursday','Friday','Saturday'],
				m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				ending = '';

			switch (d){
				case 1: ending = 'st'; break;
				case 2: ending = 'nd'; break;
				case 3: ending = 'rd'; break;
				default: ending = 'th';
			}

			document.getElementById('watches-date').innerHTML = w[date.getDay()] + ', ' + m[date.getMonth()] +' '+ d + ending;
		},
		showTime: function(){
			var time = self.UI.updateTime();
			self.pattern.check(time);
			self.alarm.check();
			self.UI.inputTime(time);			
		},
		updateTitle: function(text){
			document.title = text;
		}
	},

	self.getRandom = function(max, min) {
		var min = min || 0;
		return parseInt(Math.random() * (max - min) + min);
	},

	// events
	
	// set alarm
	self.setter = document.getElementById(this.config.fields.setter),
	self.resetter = document.getElementById(self.config.fields.reset),

	self.setter.onclick = self.alarm.set,
	self.resetter.onclick = self.alarm.reset,

	// controls alarm
	self.alarmOk = document.getElementById(this.config.alarmControls.ok),
	self.alarmCancel = document.getElementById(self.config.alarmControls.cancel),
	self.alarmStat = document.getElementById(self.config.alarmControls.status),
	self.alarmStatBox = document.getElementById(self.config.alarmControls.statusBox),

	self.alarmOk.onclick = self.alarm.reset,
	self.alarmCancel.onclick = self.alarm.snooze,

	// set song
	self.player = document.getElementById(self.config.audio.player),
	self.songs = document.getElementById(self.config.audio.songs),

	self.songs.addEventListener("change", self.alarm.setSong);
	self.player.addEventListener("ended", self.alarm.snooze);
}