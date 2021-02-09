function newButtonToggle () {

    videojs.newButton = videojs.Button.extend({
       init: function(player, options){
        videojs.Button.call(this, player, options);
        this.on('click', this.onClick);
       }
    });

    videojs.newButton.prototype.onClick = function() {
        //Add click routine here..
    };

     //Creating New Button
    var createNewButton = function() {
        var props = {
            className: 'vjs-new-button vjs-control',
            innerHTML: '<div class="vjs-control-content">' + ('New') + '</div>',
            role: 'button',
            'aria-live': 'polite', 
            tabIndex: 0
            };
        return videojs.Component.prototype.createEl(null, props);
    };

    //Adding the newly created button to Control Bar

    videojs.plugin('newButton', function() {
        var options = { 'el' : createNewButton() };
        newButton = new videojs.newButton(this, options);
        this.controlBar.el().appendChild(newButton.el());
    });

    //Now setting up Player
    var vid = videojs("sampleVideo", {
        plugins : { newButton : {} }
    });           
}








newButtonToggle();