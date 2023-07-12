项目分为俩种模式，离线与在线，通常来看如果你想修复一些简单的样式问题，以及仅限于前端的功能支持。

你可以选择采取离线的开发模式进行处理，你的所有数据都会被缓存到浏览器的 localstorage 中，这样你就可以不依赖后端对样式进行调整与开发。

你可以采取如下的一些命令去设置你的开发环境
```shell
# 安装依赖
yarn
# 启动一个前端开发服务器
yarn serve
# 验证线上效果
yarn build
yarn preview
```

当你想对后端进行开发的时候你需要配置你的环境以支持 vercel 的开发模式

- 首先你需要安装 vercel
```shell
# 安装 vercel
yarn global add vercel
# or
npm install -g vercel
```

- 登录你的 vercel 账号，如果你没有账号的话你需要注册一个
```shell
vercel login
```

- 配置一下你的环境变量，你需要在项目根目录下创建一个 .env 文件，然后在里面写入你的环境变量
```dotenv
UPSTASH_REDIS_REST_URL=你的_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=你的_redis_rest_token
# 你可以在 upstash 的控制台中找到这些信息，如果你没有创建的话，你可以前往 https://console.upstash.com/ 创建你的用户与 redis 实例

JWT_SECRET_KEY=随便写个
```

- 最后你可以通过 `yarn run:vercel` 启动你的服务器，注意控制台的输出信息，然后你就可以在本地访问服务器了

> 接口测试位于 `./dopost` 目录下，通过 IDE 选择对应的环境
>
> 然后使用 IDE 提供的能力便能对接口的能力进行测试
