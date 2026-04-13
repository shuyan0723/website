# 研发成果模块替换 - 简化执行版

## 任务
将 `kunlun-research-center(1).html` 中的横向时间轴内容替换到 `ResearchCenter.astro` 的第 412-768 行。

## 核心变化
- 垂直时间轴 → 横向时间轴
- 增加**产品介绍卡片**（自动轮播）
- 简化交互（去除拖拽，保留基础滚动）

---

## 第一步：更新 SCSS 样式

在 `src/styles/research-center.scss` 末尾添加：

```scss
// ========== 产品介绍卡片 ==========
.research-product-intro {
  @extend .glass-morphism;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
}

.research-product-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.research-product-title {
  font-size: 24px;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 8px;
}

.research-product-desc {
  color: $text-muted;
  font-size: $font-sm;
  line-height: 1.75;
  max-width: 672px;
}

.research-product-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: $font-sm;
  text-align: right;
}

.status-dot {
  display: inline-flex;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.green { background: #22c55e; }
  &.yellow { background: #eab308; }
  &.pulse { position: relative; }

  &.pulse::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: inherit;
    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
}

@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}

.research-product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-tag {
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 9999px;
  font-size: 12px;
  color: #60a5fa;
}

// ========== 横向时间轴 ==========
.timeline-scroll-area {
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.timeline-track {
  display: flex;
  align-items: flex-start;
  min-width: max-content;
  padding: 48px 16px 32px;
  gap: 0;
}

.timeline-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 288px;
}

.timeline-node:nth-child(2) {
  width: 320px;
}

.timeline-date {
  position: absolute;
  top: -32px;
  font-size: 12px;
  font-family: monospace;

  &.completed { color: $text-muted; }
  &.in-progress { color: #4ade80; font-weight: 700; }
  &.planned { color: $text-muted; }
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  position: relative;
  z-index: 1;

  &.completed {
    background: #3b82f6;
    border-color: #60a5fa;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  }

  &.in-progress {
    width: 20px;
    height: 20px;
    background: #22c55e;
    border-color: #4ade80;
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  &.planned {
    background: #334155;
    border-color: #475569;
    border-style: dashed;
  }
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.timeline-connector {
  width: 64px;
  height: 1px;
  margin-top: 8px;
  background: linear-gradient(90deg, #3b82f6, #22d3ee, #22c55e);
  position: relative;
  flex-shrink: 0;

  &.to-planned {
    background: linear-gradient(90deg, #22c55e, #475569);
  }

  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #22d3ee;
  }

  &.to-planned::after {
    border-top-color: #475569;
  }
}

.timeline-card {
  @extend .glass-morphism;
  border-radius: 12px;
  padding: 20px;
  margin-top: 32px;
  width: 100%;
  border-left: 2px solid;
  transition: all 0.3s ease;

  &.completed {
    border-color: #3b82f6;
    &:hover { border-color: #22d3ee; transform: translateY(-4px); }
  }

  &.in-progress {
    border-color: #22c55e;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }

  &.planned {
    border-color: #475569;
    opacity: 0.8;
    &:hover { opacity: 1; }
  }
}

.timeline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.timeline-card-version {
  font-size: 18px;
  font-weight: 700;

  &.completed { color: #60a5fa; }
  &.in-progress { color: #4ade80; }
  &.planned { color: #94a3b8; }
}

.timeline-card-badge {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;

  &.completed {
    background: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }

  &.in-progress {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  &.planned {
    background: rgba(51, 65, 85, 0.5);
    color: #94a3b8;
  }
}

.timeline-card-title {
  font-size: 12px;
  font-weight: 500;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.timeline-card-list {
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    font-size: 14px;
    color: $text-muted;
    padding: 4px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }
}

.timeline-card-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(51, 56, 65, 0.5);
}

.timeline-card-section-title {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.timeline-card-desc {
  font-size: 12px;
  line-height: 1.6;
  color: $text-muted;
}

.timeline-tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.timeline-tech-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #64748b;
  gap: 4px;
}

// 图例
.timeline-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: $text-muted;
  padding: 0 16px;
}

.timeline-legend-item {
  display: flex;
  align-items: center;
  gap: 4px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.blue { background: #3b82f6; }
    &.green { background: #22c55e; animation: pulse-dot 2s ease-in-out infinite; }
    &.gray { background: #475569; }
  }
}

// 移动端滚动提示
.timeline-scroll-hint {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  height: 100%;
  background: linear-gradient(to left, #0f172a, transparent);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  pointer-events: none;

  @include respond-to($breakpoint-md) {
    display: none;
  }
}
```

---

## 第二步：替换 HTML 结构

**位置**: `src/components/ResearchCenter.astro` 第 412-768 行

**替换为**:

```astro
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 五、研发成果（核心亮点：产品研发历程） -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div class="research-achievements">
      <div class="research-achievements-container">

        <!-- 标题区 -->
        <div class="research-achievements-title-row">
          <div>
            <h2 class="research-achievements-title">昆仑时代研发中心</h2>
            <p class="research-achievements-subtitle">KUNLUN R&D CENTER · 持续探索技术边界，驱动产业智能升级</p>
          </div>
          <div class="research-achievements-badges">
            <span class="research-achievements-badge">软件著作权 110+</span>
            <span class="research-achievements-badge">国家高新技术企业</span>
          </div>
        </div>

        <!-- 产品Tab切换器 -->
        <div class="research-tabs">
          <button class="research-tab-btn active" data-tab="aml">
            反洗钱智能管理系统
          </button>
          <button class="research-tab-btn" data-tab="ops">
            昆仑智能运维管理平台
          </button>
          <button class="research-tab-btn" data-tab="bid">
            标讯信息智能分析平台
          </button>
        </div>

        <!-- 产品内容容器 -->
        <div class="research-products-wrapper">
          <!-- 产品1: 反洗钱智能管理系统 -->
          <div class="research-product-panel active" id="product-aml">
            <!-- 产品介绍卡片 -->
            <div class="research-product-intro">
              <div class="research-product-header">
                <div>
                  <h3 class="research-product-title">反洗钱智能管理系统</h3>
                  <p class="research-product-desc">
                    面向金融机构复杂反洗钱场景，构建以数据驱动、模型驱动与智能决策为核心的新一代反洗钱智能管理系统。平台融合规则引擎、机器学习与图计算能力，打造覆盖交易监测、风险识别、关系分析与决策支撑的智能风控体系。
                  </p>
                </div>
                <div class="research-product-status">
                  <span class="status-dot green pulse"></span>
                  <span>已投入生产 · 中国银行合作</span>
                </div>
              </div>
              <div class="research-product-tags">
                <span class="product-tag">规则引擎</span>
                <span class="product-tag">机器学习</span>
                <span class="product-tag">图计算</span>
                <span class="product-tag">智能风控</span>
              </div>
            </div>

            <!-- 横向时间轴 -->
            <div class="timeline-area">
              <div class="timeline-legend">
                <span class="timeline-legend-item"><span class="dot blue"></span>已完成</span>
                <span class="timeline-legend-item"><span class="dot green"></span>进行中</span>
                <span class="timeline-legend-item"><span class="dot gray"></span>规划中</span>
              </div>

              <div class="timeline-scroll-area" id="timeline-aml">
                <div class="timeline-track">
                  <!-- v1.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date completed">2024.7</span>
                    <div class="timeline-dot completed"></div>
                    <div class="timeline-card completed">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version completed">v1.0</span>
                        <span class="timeline-card-badge completed">已完成</span>
                      </div>
                      <p class="timeline-card-title">体系化能力基座构建</p>
                      <ul class="timeline-card-list">
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>构建反洗钱全流程业务体系</span>
                        </li>
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                          <span>实现交易监测与监管报送能力</span>
                        </li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">创新体现</p>
                        <p class="timeline-card-desc">首次构建"监测-预警-分析-报送"一体化闭环体系，实现从人工驱动向系统驱动的转变</p>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-connector"></div>

                  <!-- v2.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date in-progress">2025.8</span>
                    <div class="timeline-dot in-progress"></div>
                    <div class="timeline-card in-progress">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version in-progress">v2.0</span>
                        <span class="timeline-card-badge in-progress">进行中</span>
                      </div>
                      <p class="timeline-card-title">模型驱动与风险识别能力突破</p>
                      <ul class="timeline-card-list">
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg>
                          <span>引入可疑交易监测模型</span>
                        </li>
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg>
                          <span>建立客户风险评级体系</span>
                        </li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">创新体现</p>
                        <p class="timeline-card-desc">实现大额及可疑交易量化规则模型体系，建立统一客户视图(KYC)，推动风险识别由经验判断向数据驱动转型</p>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-connector to-planned"></div>

                  <!-- v3.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date planned">2026.2</span>
                    <div class="timeline-dot planned"></div>
                    <div class="timeline-card planned">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version planned">v3.0</span>
                        <span class="timeline-card-badge planned">规划中</span>
                      </div>
                      <p class="timeline-card-title" style="color: rgba(34, 211, 238, 0.7);">智能风控与决策能力跃迁</p>
                      <ul class="timeline-card-list">
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span>引入机器学习模型，实现隐蔽性洗钱行为识别</span>
                        </li>
                        <li>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span>引入图计算与关系网络建模技术，实现资金流向图谱分析</span>
                        </li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">核心技术体系</p>
                        <div class="timeline-tech-grid">
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
                            <span>多源异构数据融合</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
                            <span>规则+模型双驱动</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            <span>资金流向网络分析</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <span>机器学习智能风控</span>
                          </div>
                          <div class="timeline-tech-item" style="grid-column: span 2;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <span>全流程闭环风险管理</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 产品2: 昆仑智能运维管理平台 -->
          <div class="research-product-panel" id="product-ops">
            <div class="research-product-intro">
              <div class="research-product-header">
                <div>
                  <h3 class="research-product-title">昆仑智能运维管理平台</h3>
                  <p class="research-product-desc">
                    面向企业及金融机构复杂IT环境下的运维管理需求，构建以数据驱动、流程驱动与智能决策为核心的新一代运维管理平台。通过微服务架构与云原生技术体系，融合大数据分析、人工智能与物联网技术，实现运维从"流程管控"向"智能决策"的能力跃迁。
                  </p>
                </div>
                <div class="research-product-status">
                  <span class="status-dot yellow pulse"></span>
                  <span>内部验证阶段 · 持续迭代</span>
                </div>
              </div>
              <div class="research-product-tags">
                <span class="product-tag">微服务架构</span>
                <span class="product-tag">云原生</span>
                <span class="product-tag">AIOps</span>
                <span class="product-tag">RFID融合</span>
              </div>
            </div>

            <div class="timeline-area">
              <div class="timeline-legend">
                <span class="timeline-legend-item"><span class="dot blue"></span>已完成</span>
                <span class="timeline-legend-item"><span class="dot green"></span>进行中</span>
                <span class="timeline-legend-item"><span class="dot gray"></span>规划中</span>
              </div>

              <div class="timeline-scroll-area" id="timeline-ops">
                <div class="timeline-track">
                  <!-- v1.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date completed">2024.1</span>
                    <div class="timeline-dot completed"></div>
                    <div class="timeline-card completed">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version completed">v1.0</span>
                        <span class="timeline-card-badge completed">已完成</span>
                      </div>
                      <p class="timeline-card-title">运维体系构建与能力基座打造</p>
                      <ul class="timeline-card-list">
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>构建统一运维管理平台架构</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>实现监控、工单、流程全链路打通</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>建立多端协同体系</span></li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">创新体现</p>
                        <p class="timeline-card-desc">首次构建"监控-工单-执行-反馈"一体化运维闭环体系，实现运维服务全过程数字化、可视化与标准化</p>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-connector"></div>

                  <!-- v2.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date in-progress">2025.6</span>
                    <div class="timeline-dot in-progress"></div>
                    <div class="timeline-card in-progress">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version in-progress">v2.0</span>
                        <span class="timeline-card-badge in-progress">进行中</span>
                      </div>
                      <p class="timeline-card-title">数据驱动与自动化运维体系升级</p>
                      <ul class="timeline-card-list">
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>实现资产全生命周期管理（采购-使用-维修-报废）</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>构建自动化工单流转与智能分派机制</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>建立运维数据分析与统计体系</span></li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">创新体现</p>
                        <p class="timeline-card-desc">引入RFID与多源数据融合技术实现资产实时动态感知，构建统一运维数据中台支撑多维度数据建模与分析</p>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-connector to-planned"></div>

                  <!-- v3.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date planned">2026.2</span>
                    <div class="timeline-dot planned"></div>
                    <div class="timeline-card planned">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version planned">v3.0</span>
                        <span class="timeline-card-badge planned">规划中</span>
                      </div>
                      <p class="timeline-card-title" style="color: rgba(34, 211, 238, 0.7);">智能运维与决策体系演进</p>
                      <ul class="timeline-card-list">
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>引入AIOps能力，实现智能运维体系构建</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>建立运维知识库与智能推荐体系</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>构建设备健康度模型与预测性维护能力</span></li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">核心技术体系</p>
                        <div class="timeline-tech-grid" style="grid-template-columns: 1fr;">
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>
                            <span>基于大数据与AI算法，实现故障预测、智能诊断与自动决策</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                            <span>构建"设备端+边缘计算+云平台"三层智能运维架构</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                            <span>实现运维模式由"被动响应"向"主动预防+智能决策"转型</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 产品3: 标讯信息智能分析平台 -->
          <div class="research-product-panel" id="product-bid">
            <div class="research-product-intro">
              <div class="research-product-header">
                <div>
                  <h3 class="research-product-title">标讯信息智能分析平台</h3>
                  <p class="research-product-desc">
                    基于多源数据融合与智能分析技术，构建新一代标讯信息智能分析平台。平台以数据驱动与算法驱动为核心，实现标讯信息的智能筛选、商机识别与市场洞察，逐步从信息处理工具演进为面向企业投标决策的智能化支撑系统。
                  </p>
                </div>
                <div class="research-product-status">
                  <span class="status-dot yellow pulse"></span>
                  <span>内部应用阶段 · 持续优化</span>
                </div>
              </div>
              <div class="research-product-tags">
                <span class="product-tag">RPA采集</span>
                <span class="product-tag">智能标签</span>
                <span class="product-tag">商机识别</span>
                <span class="product-tag">AI算法</span>
              </div>
            </div>

            <div class="timeline-area">
              <div class="timeline-legend">
                <span class="timeline-legend-item"><span class="dot blue"></span>已完成</span>
                <span class="timeline-legend-item"><span class="dot green"></span>进行中</span>
                <span class="timeline-legend-item"><span class="dot gray"></span>规划中</span>
              </div>

              <div class="timeline-scroll-area" id="timeline-bid">
                <div class="timeline-track">
                  <!-- v1.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date completed">2024.9</span>
                    <div class="timeline-dot completed"></div>
                    <div class="timeline-card completed">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version completed">v1.0</span>
                        <span class="timeline-card-badge completed">已完成</span>
                      </div>
                      <p class="timeline-card-title">基础能力建设</p>
                      <ul class="timeline-card-list">
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>标讯采集与信息管理</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg><span>数据统计与基础分析</span></li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">创新体现</p>
                        <p class="timeline-card-desc">初步构建多源标讯数据统一管理体系，建立"采集-存储-分析"一体化数据处理链路，相较人工检索实现信息获取效率显著提升</p>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-connector"></div>

                  <!-- v2.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date in-progress">2025.4</span>
                    <div class="timeline-dot in-progress"></div>
                    <div class="timeline-card in-progress">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version in-progress">v2.0</span>
                        <span class="timeline-card-badge in-progress">进行中</span>
                      </div>
                      <p class="timeline-card-title">数据整合 + 业务赋能</p>
                      <ul class="timeline-card-list">
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>多平台标讯数据集成（统一数据源）</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>智能筛选与标签匹配机制</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>客户与商机识别能力提升</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/><path d="M20 12h6"/></svg><span>支持重点客户与关键词规则配置</span></li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">创新体现</p>
                        <p class="timeline-card-desc">构建统一数据视图系统性解决数据分散问题，引入规则引擎实现标讯数据自动标签化与结构化处理，构建客户、竞对与商机多维识别模型</p>
                      </div>
                    </div>
                  </div>

                  <div class="timeline-connector to-planned"></div>

                  <!-- v3.0 -->
                  <div class="timeline-node">
                    <span class="timeline-date planned">2026.1</span>
                    <div class="timeline-dot planned"></div>
                    <div class="timeline-card planned">
                      <div class="timeline-card-header">
                        <span class="timeline-card-version planned">v3.0</span>
                        <span class="timeline-card-badge planned">规划中</span>
                      </div>
                      <p class="timeline-card-title" style="color: rgba(34, 211, 238, 0.7);">AI驱动 + 决策支持</p>
                      <ul class="timeline-card-list">
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>实现平台由"信息工具"向"智能决策系统"的能力跃迁</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>引入AI算法模型，显著提升商机识别精准度</span></li>
                        <li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>支撑企业从数据分析到业务决策的全链路能力升级</span></li>
                      </ul>
                      <div class="timeline-card-section">
                        <p class="timeline-card-section-title">核心技术体系</p>
                        <div class="timeline-tech-grid">
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                            <span>多源数据采集（RPA+API）</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span>智能标签与规则引擎</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v4"/><path d="M9 2v4"/><path d="M15 18v4"/><path d="M9 18v4"/><path d="M2 9h4"/><path d="M2 15h4"/><path d="M18 9h4"/><path d="M18 15h4"/></svg>
                            <span>高性能数据处理引擎</span>
                          </div>
                          <div class="timeline-tech-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>
                            <span>SpringBoot+Vue微服务</span>
                          </div>
                          <div class="timeline-tech-item" style="grid-column: span 2;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
                            <span>Redis缓存与高并发处理能力</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
```

---

## 第三步：更新脚本

**位置**: `src/components/ResearchCenter.astro` 中的 `<script>` 标签

**替换为**:

```astro
<script>
  // Tab切换功能
  const tabBtns = document.querySelectorAll('.research-tab-btn');
  const productPanels = document.querySelectorAll('.research-product-panel');

  function switchProduct(index: number) {
    const tabs = ['aml', 'ops', 'bid'];

    // 更新按钮样式
    tabBtns.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 切换产品面板
    productPanels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('active');
        panel.style.animation = 'fadeIn 0.3s ease-out';
      } else {
        panel.classList.remove('active');
        panel.style.animation = '';
      }
    });

    // 自动滚动到v2.0位置（约1/3处）
    setTimeout(() => {
      const wrapper = document.getElementById(`timeline-${tabs[index]}`);
      if (wrapper) {
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;
        wrapper.scrollLeft = (scrollWidth - clientWidth) / 3;
      }
    }, 100);
  }

  // 绑定Tab点击事件
  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => switchProduct(index));
  });

  // 页面加载后默认滚动到v2.0
  setTimeout(() => {
    ['aml', 'ops', 'bid'].forEach(id => {
      const wrapper = document.getElementById(`timeline-${id}`);
      if (wrapper) {
        const scrollWidth = wrapper.scrollWidth;
        const clientWidth = wrapper.clientWidth;
        wrapper.scrollLeft = (scrollWidth - clientWidth) / 3;
      }
    });
  }, 500);

  // 淡入动画（保留原有滚动触发动画）
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.classList.contains('count-up')) {
          const target = parseInt((entry.target as HTMLElement).dataset.target || '0');
          animateCountUp(entry.target as HTMLElement, target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .count-up').forEach(el => {
    observer.observe(el);
  });

  function animateCountUp(element: HTMLElement, target: number, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toString();
      }
    }, 16);
  }
</script>
```

---

## 补充样式

在 `src/styles/research-center.scss` 中还需要添加：

```scss
// ========== 标题行 ==========
.research-achievements-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.research-achievements-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 24px;
}

.research-achievements-title {
  font-size: 30px;
  font-weight: 700;
  color: $bg-white;
  margin-bottom: 8px;
}

.research-achievements-subtitle {
  color: $text-muted;
  font-size: $font-sm;
}

.research-achievements-badges {
  display: none;
  gap: 8px;

  @include respond-to($breakpoint-md) {
    display: flex;
  }
}

.research-achievements-badge {
  padding: 4px 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 6px;
  font-size: 12px;
  color: #60a5fa;
}

.research-achievements-badge:last-child {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

// ========== 产品面板 ==========
.research-products-wrapper {
  position: relative;
}

.research-product-panel {
  display: none;

  &.active {
    display: block;
  }
}

.timeline-area {
  position: relative;
}

// ========== 动画 ==========
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 修改清单

| 文件 | 操作 |
|------|------|
| `src/styles/research-center.scss` | 添加新样式（约250行） |
| `src/components/ResearchCenter.astro` | 替换第412-768行 + 更新script |

---

**文档版本**: v2 简化执行版
**更新时间**: 2026-04-13
