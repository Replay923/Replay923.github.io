HomerunChampion.Title = function() {}, HomerunChampion.Title.prototype = {
    create: function() {
        console.log("title"), this.game.add.sprite(0, 0, "bg_title"), 
        this.titleLogo = this.game.add.sprite(321, 220, "logo_title"), 
        this.titleLogo.anchor.setTo(.5, .5), 
        this.moregamesBtn = this.game.add.sprite(.5 * this.game.world.width, .94 * this.game.world.height, "btn_moregames"),
         this.moregamesBtn.anchor.setTo(.5, .5), this.moregamesBtn.scale.setTo(.35, .35), 
         this.moregamesBtn.inputEnabled = !0, this.moregamesBtn.events.onInputDown.add(this.onMoreGames), 
    this.playBtn = this.game.add.button(.5 * this.game.world.width, .8 * this.game.world.height, "btn_play", this.onPlay, this, null, null, 0, 1), 
         this.playBtn.anchor.setTo(.5, .5), 
         this.creditBtn = this.game.add.button(.75 * this.game.world.width, .83 * this.game.world.height, "btn_credits", this.onCredit, this, null, null, 0, 1),
        this.creditBtn.anchor.setTo(.5, .5), 
    this.soundoffBtn = this.game.add.button(.25 * this.game.world.width, .83 * this.game.world.height, "btn_audio_off", this.onAudio, this, null, null, 1), 
          this.soundoffBtn.anchor.setTo(.5, .5), this.soundoffBtn.visible = !1, 
          this.soundonBtn = this.game.add.button(.25 * this.game.world.width, .83 * this.game.world.height, "btn_audio_on", this.onAudio, this, null, null, 1), this.soundonBtn.anchor.setTo(.5, .5), this.tempalabsBtn = this.add.button(5, 5, "tempalabs", this.onTempalabs, this, null), this.tempalabsBtn.scale.setTo(.6, .6), this.creditGroup = this.game.add.group();
        var t = this.creditGroup.create(0, 0, "bg_popup");
        t.anchor.setTo(.5, .5), t.x = .5 * this.game.world.width, t.y = .5 * this.game.world.height;
        var i = this.game.add.button(.5 * this.game.world.width, .75 * this.game.world.height, "btn_close", this.onCredit, this, null, 0, 1);
        i.anchor.setTo(.5, .5), this.creditGroup.add(i);
        var o = this.game.add.bitmapText(.225 * this.game.world.width, .22 * this.game.world.height, "deathemaach", "CREDITS", 50);
        o.setText("CREDITS\n\n-PROGRAMMER-\nAlif Harsan Pradipto\n-ART-\nNovpixel\n-MUSIC-\nAnto"), o.align = "center", this.creditGroup.add(o), this.creditGroup.visible = !1, this.scaleCount = 0
    },
    onMoreGames: function() {
        window.famobi.moreGamesLink()
    },
    onTempalabs: function() {
        1 != this.creditGroup.visible && window.famobi.moreGamesLink()
    },
    update: function() {
        this.scaleCount += .04, this.scaleCount > 360 && (this.scaleCount = 0), this.titleLogo.scale.setTo(1 + .1 * Math.sin(this.scaleCount), 1 + .1 * Math.sin(this.scaleCount))
    },
    onPlay: function() {
        1 != this.creditGroup.visible && (UtilSound.playSound("sfx_button"), this.game.state.start("level"))
    },
    onAudio: function() {
        1 != this.creditGroup.visible && (UtilSound.playSound("sfx_button"), 0 == UtilSound.isMute ? (UtilSound.mute(), this.soundoffBtn.visible = !0, this.soundonBtn.visible = !1) : (UtilSound.unmute(), this.soundoffBtn.visible = !1, this.soundonBtn.visible = !0))
    },
    onCredit: function() {
        UtilSound.playSound("sfx_button"), this.creditGroup.visible = !this.creditGroup.visible
    }
};