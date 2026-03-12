// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    baseUrl: 'http://localhost:3000/api',
    userLevel: 'free'
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
      }
    });
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.userLevel = userInfo.user_level || 'free';
    }
  },

  // 微信登录
  async wechatLogin() {
    try {
      const loginRes = await wx.login();
      if (loginRes.code) {
        // 调用后端登录接口
        const response = await this.request({
          url: '/auth/wechat-login',
          method: 'POST',
          data: {
            code: loginRes.code
          }
        });

        if (response.success) {
          // 保存登录信息
          this.globalData.token = response.token.access_token;
          this.globalData.userInfo = response.user;
          this.globalData.userLevel = response.user.user_level;
          
          wx.setStorageSync('token', response.token.access_token);
          wx.setStorageSync('userInfo', response.user);
          
          return response;
        }
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 封装网络请求
  async request(options) {
    const header = {
      'Content-Type': 'application/json'
    };

    // 如果有token，添加到请求头
    if (this.globalData.token) {
      header['Authorization'] = `Bearer ${this.globalData.token}`;
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.baseUrl + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: header,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            // token过期，清除登录状态
            this.clearLoginStatus();
            reject(new Error('登录已过期，请重新登录'));
          } else {
            reject(new Error(res.data.error || '请求失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  // 清除登录状态
  clearLoginStatus() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    this.globalData.userLevel = 'free';
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  }
})