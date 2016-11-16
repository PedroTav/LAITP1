/**
 * LinearAnimation
 * @constructor
 */
 function LinearAnimation(controlvector, time) {
 	
 	this.controlvector = controlvector;
 	this.time = time;
    
    this.velocity = this.getVelocity();

    this.currentControlPoint = controlvector[1];
    
    var x = this.currentControlPoint.getX() - controlvector[0].getX();
    var y = this.currentControlPoint.getY() - controlvector[0].getY();
    var z = this.currentControlPoint.getZ() - controlvector[0].getZ();
    this.currentPath = new Coords(x, y, z);

    this.dx = controlvector[1].getX() - controlvector[0].getX();
    this.dy = controlvector[1].getY() - controlvector[0].getY();
    this.dz = controlvector[1].getZ() - controlvector[0].getZ();

    this.curDx = 0.0;
    this.curDy = 0.0;
    this.curDz = 0.0;

    this.over = false;

    this.currentControlPointIndex = 1;

    this.x = controlvector[0].getX();
    this.y = controlvector[0].getY();
    this.z = controlvector[0].getZ();
 };


 LinearAnimation.prototype.constructor = LinearAnimation;

 LinearAnimation.prototype.getPosition = function(dt)
 { 
    console.log(this.currentControlPointIndex);

   var transformation = new MyFullTransform();

   if(this.over)
    {
        var t = new MyTransformation();
        t.setTranslate(this.x, this.y, this.z);

        transformation.addTransform(t);

        return transformation;
    }

   if(this.curDx > this.dx || this.curDy > this.dy || this.curDz > this.dz)
   {
      this.currentControlPointIndex++;

      if(this.currentControlPointIndex == this.controlvector.length)
      {
        this.over = true;
      }
      else
      {
          this.updateControlPoint();
      }

      console.log(this.curDx);
   }
   else
   {
       var dif = dt*this.velocity;

       this.x += dif*this.currentPath.getX();
       this.y += dif*this.currentPath.getY();
       this.z += dif*this.currentPath.getZ();

       this.curDx += Math.abs(dif*this.currentPath.getX());
       this.curDy += Math.abs(dif*this.currentPath.getY());
       this.curDz += Math.abs(dif*this.currentPath.getZ());

       var transf = new MyTransformation();
       transf.setTranslate(this.x, this.y, this.z);

       transformation.addTransform(transf);

       return transformation;
   }
 }

 LinearAnimation.prototype.getVelocity = function() {
   
   var total = 0;

   for(var i = 1; i < this.controlvector.length; i++)
   {
     var difX = this.controlvector[i].getX() - this.controlvector[i - 1].getX();
     var difY = this.controlvector[i].getY() - this.controlvector[i - 1].getY();
     var difZ = this.controlvector[i].getZ() - this.controlvector[i - 1].getZ();

     var dif = Math.sqrt(difX*difX + difY*difY + difZ*difZ);

     total += dif;
   }

    return total/this.time;
 }

LinearAnimation.prototype.updateControlPoint = function()
{
      var index = this.currentControlPointIndex;
      
      this.currentControlPoint = this.controlvector[index];

      var x = this.currentControlPoint.getX() - this.controlvector[index - 1].getX();
      var y = this.currentControlPoint.getY() - this.controlvector[index - 1].getY();
      var z = this.currentControlPoint.getZ() - this.controlvector[index - 1].getZ();
      this.currentPath.x = x;
      this.currentPath.y = y;
      this.currentPath.z = z;

      this.dx = this.controlvector[index].getX() - this.controlvector[index - 1].getX();
      this.dy = this.controlvector[index].getY() - this.controlvector[index - 1].getY();
      this.dz = this.controlvector[index].getZ() - this.controlvector[index - 1].getZ();

      this.curDx = 0;
      this.curDy = 0;
      this.curDz = 0;

      console.log(this.curDx);
}