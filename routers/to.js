router.get('/topic/:id', async (ctx, next) => {
  var Id = ctx.params.id;
  let topic = await Topic.findById(Id);
  let tc_time = moment(topic.createdAt).fromNow();//话题创建时间
  let tu_time = moment(topic.updatedAt).fromNow();//话题更新时间
  let res_clicks = topic.clicks;
  res_clicks++;//话题浏览数+1
  await topic.update({
    clicks: res_clicks
  });

//从数据库查询到当前话题
  let top = await Topic.findAll({
    where: {
      userid: topic.userid
    }
  });

  // 从数据库查询到当前话题所有的评论
  let reply = await Reply.findAll({
    where: {
      topicId: Id
    }
  });

  // 更新回复距现在的时间
  for(var i of reply){
    var time=i.replytime;
    await i.update({
     replyfromnow: moment(time).fromNow()
    });
  };
  
  var reply_res; 
  if (reply) {
    reply_res = reply;
    var like_res = [];
    reply_res.forEach(function(res, index) {
      var res_id = res['id'];
      var like = await Like.findOne({
        where: { nameId: ctx.session.id, replyId: res_id }
      });    
      if (like == null) {
          like_res[index] = 0;
      } else {
          like_res[index] = like;
      }     
    });
  } else if (reply == null) {
    reply_res = 0;
  };

  await ctx.render('/stopic', {
    session: ctx.session,
    topics: topic,
    ttime: [tc_time, tu_time],
    stopics: top,
    replys: reply_res,
    likes: like_res
  });
});

