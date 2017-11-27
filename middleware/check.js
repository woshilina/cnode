module.exports ={ 
    checkNotLogin:function (ctx) {
      if (ctx.session && ctx.session.user) {     
        ctx.redirect('/topics');
        return false;
      }
      return true;
    },
  
    checkLogin:function (ctx) {
      if (!ctx.session || !ctx.session.user) {     
        ctx.redirect('/onload');
        return false;
      }
      return true;
    }
  }