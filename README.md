# Telco Project Office

Phase 1 prototype for a Telco Project Office demo. It is a Vite + React front-end with a local HTTP action gateway and safe sample data only.

注意素材版权问题！This prototype does not include real AI/LLM calls, secret keys, confidential customer data, production authentication, or real integrations.




## 运行

```bash
npm install
npm run dev
```

默认使用 HTTP 驱动角色动作。`npm run dev` 会同时启动：

- Vite 前端
- HTTP Action Gateway

默认动作入口为：

```bash
http://localhost:8765/actions
```

外部系统向该地址 `POST` 安全演示动作，前端会通过 HTTP 轮询取走并执行。

如需指定前端轮询地址：

```bash
VITE_OFFICE_HTTP_ACTIONS_URL=http://localhost:8765/actions npm run dev
```

如需单独启动动作网关：

```bash
npm run action-gateway
```

如需修改动作网关端口：

```bash
OFFICE_ACTION_GATEWAY_PORT=8766 npm run action-gateway
```

## HTTP 消息

单次角色拜访：

```bash
curl -X POST http://localhost:8765/actions \
  -H 'Content-Type: application/json' \
  -d '{"type":"desk_visit","visitor":1,"host":2,"message":"Technical Agent, please review feasibility and dependencies."}'
```

消息体示例：

```json
{
  "type": "desk_visit",
  "visitor": 1,
  "host": 2,
  "message": "Technical Agent, please review feasibility and dependencies."
}
```

连续拜访多个角色：

```json
{
  "type": "desk_visit_tour",
  "visitor": 1,
  "hosts": [2, 3],
  "message": "Align scope, dependencies, milestones and next actions."
}
```

设置员工状态：

```json
{
  "type": "set_state",
  "rosterNo": 1,
  "state": "working",
  "task": "Reviewing customer requirements and commercial assumptions…"
}
```
