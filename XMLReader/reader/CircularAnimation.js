/**
 * CircularAnimation
 * @constructor
 */
 function CircularAnimation(center, r, startAng, rotAng, time) {

    Animation.call(this);
 	
 	this.center = center;
 	this.r = r;
 	this.startAng = startAng;
 	this.rotAng = rotAng;
 	this.time = time;

 	this.currAng = startAng;
    
    this.velocity = this.getVelocity();

    this.over = false;
 };


 CircularAnimation.prototype.constructor = CircularAnimation;

 CircularAnimation.prototype.getPosition = function(dt)
 { 
       if(this.currAng >= this.rotAng + this.startAng)
       {
           this.over = true;
       }
       
       var transformation = new MyFullTransform();

       if(!this.over)
       {
           var dif = this.velocity*dt;

           this.currAng += dif/this.r;
       }

       var t3 = new MyTransformation();
       t3.setTranslate(this.center.getX() + Math.cos(this.currAng)*(this.r), this.center.getY(), Math.sin(this.currAng)*(this.r) + this.center.getZ());

       transformation.addTransform(t3);

       var t2 = new MyTransformation();
       t2.setRotate(0, -1, 0, this.currAng);

       transformation.addTransform(t2);

       return transformation;
 }

 CircularAnimation.prototype.getVelocity = function() {
   
     var l = this.rotAng*this.r;
   
     return l/this.time;
 }