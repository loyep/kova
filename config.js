module.exports = {
    serverPort: 3001,
      css: () => {
          return {
            loaderOptions: {
              less: {
                // 透传参数给 less-loader
                lessOptions: {
                  modifyVars: {
                    'primary-color': '#409eff',
                  //   'link-color': '#1DA57A',
                    'border-radius-base': '4px'
                  },
                  javascriptEnabled: true
                }
              }
            }
          }
        }
        
  }
  