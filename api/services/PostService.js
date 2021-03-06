module.exports = {

  create: async(data,req) => {
    try {

      let user = UserService.getLoginUser(req);

      let itme;
      if( !data.detail.radioItem ){
        itme = await ItemService.create({
          LikeId: data.hobby,
          itemname: data.detail.item
        });

      }

      let post = await Post.create({
        title: data.detail.title,
        content: '',
        mode: data.mode,
        ItemId: data.detail.radioItem || itme.id,
        UserId: user.id,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        geometry: {
          type: 'Point',
          coordinates: [data.location.latitude,data.location.longitude]
        }
      });
      return post;
    } catch (e) {
      throw e;
    }
  },

  getAllPost: async() => {
    try {
      let getPost = await Post.findAll({
        include:[{
          model: Item,
          include: Like
        },{
          model: User
        }]
      });
      sails.log.info(getPost[0]);


      let postArray = getPost.map((post) => {
        let data = {
          title: post.title,
          mode: post.mode,
          location : post.Item.itemname,
          latitude: post.latitude,
          longitude: post.longitude,
          url: `/postDetail/${post.id}`,
          type: post.Item.Like.title,
          // type_icon: post.Item.Like.icon,
          type_icon: "../icons/store/apparel/bags.png",
          gallery:['../img/hobby/3c.png']
        };
        return data;
      });

      postArray = {
        data: postArray
      }
      return postArray;
    } catch (e) {
      throw e;
    }
  },

  getPostById: async(id) => {
    try {
      let getPost = await await Post.findOne({
        where:{
          id: id
        },
        include:[{
          model: Item,
          include: Like
        },{
          model: User
        }]
      });
      sails.log.info(getPost);

      let data = {
        title: getPost.title,
        mode: getPost.mode,
        location : getPost.Item.itemname,
        latitude: getPost.latitude,
        longitude: getPost.longitude,
        url: `/getPostDetail/${getPost.id}`,
        type: getPost.Item.Like.title,
        // type_icon: getPost.Item.Like.icon,
        type_icon: "../icons/store/apparel/bags.png",
        gallery:['../img/hobby/3c.png'],
        username: getPost.User.username,
        email: getPost.User.email,
        itemname: getPost.Item.itemname,
      };

      return data;
    } catch (e) {
      throw e;
    }
  },

}
