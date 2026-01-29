import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import mysql.connector
import urllib.parse
# ⬇️ 关键步骤：从 style.py 导入样式函数
from style import apply_agricultural_style

# ==========================================
# 0. 页面初始化
# ==========================================
st.set_page_config(page_title="明清农业数据库平台", page_icon="🌾", layout="wide")

# 🎨 调用外部样式文件
apply_agricultural_style()

# ==========================================
# 1. 数据库配置
# ==========================================
DB_USER = 'YuuShuo'
DB_PASSWORD = 'Lys20050220'
DB_HOST = 'localhost'
DB_NAME = 'mingqing agricultural database'


# ==========================================
# 2. 核心功能函数
# ==========================================

@st.cache_resource
def get_database_engine():
    try:
        connection_str = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}"
        engine = create_engine(
            connection_str,
            connect_args={'database': DB_NAME}
        )
        return engine
    except Exception as e:
        st.error(f"❌ 无法创建数据库引擎: {e}")
        return None


def run_query(query_sql):
    """执行 SQL 查询并返回 DataFrame"""
    engine = get_database_engine()
    if engine:
        try:
            with engine.connect() as conn:
                df = pd.read_sql(query_sql, conn)
                return df
        except Exception as e:
            st.error(f"SQL执行出错: {e}")
            return pd.DataFrame()
    return pd.DataFrame()


def get_all_tables():
    """自动获取数据库中所有的表名"""
    df = run_query("SHOW TABLES;")
    if not df.empty:
        return df.iloc[:, 0].tolist()
    return []


def get_table_columns(table_name):
    """获取指定表的所有列名"""
    df = run_query(f"SHOW COLUMNS FROM `{table_name}`;")
    if not df.empty:
        return df['Field'].tolist()
    return []


# ==========================================
# 3. 页面逻辑 (UI)
# ==========================================

# --- 侧边栏 ---
st.sidebar.title("📌 数据库导航")

all_tables = get_all_tables()

if not all_tables:
    st.sidebar.warning("⚠️ 未检测到数据表，请检查数据库连接。")
    st.stop()

selected_table = st.sidebar.selectbox("📂 请选择数据表", all_tables)
st.sidebar.success(f"已加载: {selected_table}")
st.sidebar.markdown("---")

page = st.sidebar.radio("功能模块", ["🏠 项目概览", "🔍 智能检索", "📊 数据分析"])

# --- 页面 1: 概览 ---
if page == "🏠 项目概览":
    st.title("✨ 明清农业数据库展示平台")

    # 1. 项目介绍
    st.header("📖 项目介绍")
    st.markdown("""
    本项目致力于构建一个全面、可视化的**明清时期农业数据展示平台**。通过数字化手段，
    整理并呈现明清时期的农业生产、作物分布、灾害记录及相关经济数据。

    * **核心目标**：挖掘历史数据价值，为农业史研究提供便捷的检索与分析工具。
    * **数据来源**：基于历史文献整理的 MySQL 数据库。
    * **技术支持**：Python Streamlit 快速开发框架 + SQLAlchemy 数据驱动。
    """)
    st.markdown("---")  # 分割线

    # 2. 项目成员简介
    st.header("👥 项目成员简介")

    # 定义成员数据列表
    team_members = [
        {
            "name": "成员 A",
            "role": "项目负责人 / 全栈开发",
            "desc": "负责项目整体架构设计、数据库搭建以及前端可视化实现，统筹项目进度。",
            "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        },
        {
            "name": "成员 B",
            "role": "历史考证 / 数据整理",
            "desc": "负责明清史料的搜集、清洗、录入及数据的学术校对，确保数据准确性。",
            "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
        },
        {
            "name": "成员 C",
            "role": "UI 设计 / 数据分析",
            "desc": "负责平台界面风格设计及农业数据的统计分析工作，制作可视化图表。",
            "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco"
        },
        {
            "name": "成员 D",
            "role": "后端支持 / 运维",
            "desc": "负责服务器维护、SQL 性能优化以及数据安全备份策略的制定。",
            "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave"
        },
        {
            "name": "成员 E",
            "role": "文献检索 / 内容编辑",
            "desc": "协助查阅地方志，提取关键农业指标，并撰写项目文档与报告。",
            "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Eliza"
        },
        {
            "name": "成员 F",
            "role": "测试 / 用户体验",
            "desc": "负责平台的功能测试，收集用户反馈并优化交互流程。",
            "img": "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank"
        },
    ]

    for member in team_members:
        col_img, col_text = st.columns([1, 5])
        with col_img:
            st.image(member["img"], width=120)
        with col_text:
            st.subheader(f"🧑‍💻 {member['name']}")
            st.write(f"**角色**：{member['role']}")
            st.caption(member['desc'])
        st.markdown("---")

    # 3. 系统状态
    st.header("🖥️ 系统状态")
    st.info(f"""
    * **当前连接数据库**: `{DB_NAME}`
    * **系统包含数据表**: {len(all_tables)} 个
    * **当前选中操作表**: `{selected_table}`
    """)
    st.markdown("---")  # 分割线

    # 4. 数据概览
    st.header(f"📋 `{selected_table}` 数据概览")
    st.caption("以下展示当前选中表的前 50 条数据记录：")
    df_preview = run_query(f"SELECT * FROM `{selected_table}` LIMIT 50")
    st.dataframe(df_preview, use_container_width=True)

# --- 页面 2: 检索 (多条件筛选升级版) ---
elif page == "🔍 智能检索":
    st.title("🗄️ 高级数据检索")
    st.markdown("请选择您需要展示的字段，并可添加**多个筛选条件**进行组合查询。")

    # 1. 获取所有列名
    all_columns = get_table_columns(selected_table)

    if all_columns:
        # ==========================
        # 步骤 A: 选择要显示的列 (SELECT ...)
        # ==========================
        st.subheader("选择显示字段")
        selected_columns = st.multiselect(
            "请选择要展示的数据列：",
            all_columns,
            default=all_columns
        )

        # ==========================
        # 步骤 B: 多条件筛选 (WHERE ...)
        # ==========================
        st.subheader("组合筛选条件")

        # 使用 session_state 初始化筛选列表
        # 结构: [{'id': 0, 'logic': 'AND'}]
        if 'filters' not in st.session_state:
            st.session_state.filters = []

        # 两个小按钮：添加 和 清空
        col_btns, col_dump = st.columns([2, 5])
        with col_btns:
            col_add, col_clear = st.columns(2)
            with col_add:
                if st.button("添加条件"):
                    st.session_state.filters.append({})  # 添加一个空字典占位
            with col_clear:
                if st.button("清空条件"):
                    st.session_state.filters = []

        # 运算符映射
        operator_map = {
            "等于 (=)": "=",
            "包含 (LIKE)": "LIKE",
            "大于 (>)": ">",
            "小于 (<)": "<",
            "大于等于 (≥)": ">=",
            "小于等于 (≤)": "<="
        }

        # 存储生成的 SQL 片段
        where_conditions = []

        if st.session_state.filters:
            st.caption("💡 提示：第一个条件的逻辑关系会被忽略。")

            # 遍历 session_state 中的过滤器列表，动态生成控件
            for i, _ in enumerate(st.session_state.filters):
                st.markdown(f"**条件 {i + 1}**")

                # 动态布局：如果是第1个条件，不需要逻辑词；之后的需要
                if i == 0:
                    c1, c2, c3 = st.columns([2, 1, 2])
                    logic = "AND"  # 默认值，不显示控件
                else:
                    c0, c1, c2, c3 = st.columns([1, 2, 1, 2])
                    with c0:
                        logic = st.selectbox("逻辑", ["AND", "OR"], key=f"logic_{i}")

                # 字段、运算符、值
                with c1:
                    col_name = st.selectbox("字段", all_columns, key=f"col_{i}")
                with c2:
                    op_display = st.selectbox("关系", list(operator_map.keys()), key=f"op_{i}")
                    op_sql = operator_map[op_display]
                with c3:
                    val = st.text_input("值", key=f"val_{i}")

                # --- 构建当前行的 SQL 片段 ---
                if val:  # 只有填了值才生效
                    safe_val = val.replace("'", "''")

                    # 构建单个条件语句
                    if op_sql == "LIKE":
                        condition = f"`{col_name}` LIKE '%{safe_val}%'"
                    elif op_sql == "=":
                        condition = f"`{col_name}` = '{safe_val}'"
                    else:
                        # 数字判断
                        if safe_val.replace('.', '', 1).isdigit():
                            condition = f"`{col_name}` {op_sql} {safe_val}"
                        else:
                            condition = f"`{col_name}` {op_sql} '{safe_val}'"

                    # 将逻辑词和条件存入列表
                    # 格式: ('AND', "age > 10")
                    where_conditions.append((logic, condition))

        # ==========================
        # 步骤 C: 执行查询
        # ==========================
        st.markdown("---")
        # 居中显示大按钮
        btn_col1, btn_col2, btn_col3 = st.columns([1, 2, 1])
        with btn_col2:
            search_clicked = st.button("点击开始检索", use_container_width=True)

        if search_clicked:
            # 1. 构建 SELECT
            if not selected_columns:
                select_part = "*"
            else:
                select_part = ", ".join([f"`{col}`" for col in selected_columns])

            # 2. 构建 WHERE
            full_where_clause = ""
            if where_conditions:
                # 处理第一个条件 (不需要前面的逻辑词)
                first_logic, first_cond = where_conditions[0]
                full_where_clause = f"WHERE {first_cond}"

                # 处理后续条件
                for logic, cond in where_conditions[1:]:
                    full_where_clause += f" {logic} {cond}"

            # 3. 拼装 SQL
            full_sql = f"SELECT {select_part} FROM `{selected_table}` {full_where_clause}"

            st.success("✅ 查询已执行")

            # 调试信息
            with st.expander("🔧 查看 SQL 语句"):
                st.code(full_sql, language="sql")

            # 4. 运行
            df_result = run_query(full_sql)

            if not df_result.empty:
                st.write(f"📊 找到 **{len(df_result)}** 条结果：")
                st.dataframe(df_result, use_container_width=True)
            else:
                st.warning("⚠️ 未找到匹配数据。")

    else:
        st.error("无法读取表结构。")

# --- 页面 3: 分析 ---
elif page == "📊 数据分析":
    st.title("📈 基础分布统计")
    columns = get_table_columns(selected_table)

    if columns:
        st.info("💡 提示：请选择 '类别型' 字段（如省份、作物名称）进行统计。")
        target_col = st.selectbox("选择统计字段", columns)

        if st.button("生成统计图表"):
            try:
                sql = f"SELECT `{target_col}`, COUNT(*) as count FROM `{selected_table}` GROUP BY `{target_col}` ORDER BY count DESC LIMIT 20"
                df_chart = run_query(sql)

                if not df_chart.empty:
                    st.write(f"### `{target_col}` 分布情况")
                    st.bar_chart(df_chart.set_index(target_col))
                else:
                    st.warning("暂无数据")
            except Exception as e:
                st.error(f"统计失败: {e}")