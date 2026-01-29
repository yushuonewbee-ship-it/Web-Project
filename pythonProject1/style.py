import streamlit as st


def apply_agricultural_style():
    """
    应用‘清风麦浪’农业主题配色方案（视觉协调终极版）
    修改点：
    1. 修正多选框标签颜色（由红改麦穗黄）
    2. 修复输入框文字/光标不可见的问题（强制深色文字）
    3. 统一按钮色调
    """
    st.markdown("""
    <style>
        /* =================================
           1. 全局背景：纸张纹理与色彩调整
           ================================= */
        .stApp {
            background-color: #F5EDCB; 
            background-image: 
                radial-gradient(at 10% 10%, rgba(0,0,0,0.03) 0%, transparent 50%),
                radial-gradient(at 90% 90%, rgba(0,0,0,0.03) 0%, transparent 50%),
                url("https://www.transparenttextures.com/patterns/cream-paper.png"); 
            background-repeat: repeat;
            color: #4B3621; 
        }

        /* =================================
           2. 侧边栏
           ================================= */
        section[data-testid="stSidebar"] {
            background-color: #D6E0D6; 
            border-right: 1px solid #C4CFC4; 
        }
        section[data-testid="stSidebar"] p, 
        section[data-testid="stSidebar"] span {
            color: #2F4F2F !important;
        }

        /* =================================
           3. 标题与字体
           ================================= */
        h1, h2, h3 {
            color: #3A5F38 !important; 
            font-family: "Microsoft YaHei", "Songti SC", serif; 
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1); 
        }

        /* =================================
           4. DataFrame 表格美化
           ================================= */
        div[data-testid="stDataFrame"] {
            background-color: #E6EBD4 !important; 
            border: 1px solid #BCCFB4;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.05); 
        }
        div[data-testid="stDataFrame"] div[class*="stDataFrame"] {
             background-color: #E6EBD4 !important;
        }

        /* =================================
           5. 按钮样式 (检索按钮等)
           ================================= */
        .stButton>button {
            background-color: #4A6A45; /* 统一为橄榄绿 */
            color: #FAFAD2 !important; /* 浅米色文字 */
            border-radius: 6px;
            border: 1px solid #3B5537;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .stButton>button:hover {
            background-color: #2E4B2B; /* 悬停变深绿 */
            color: #FFFFFF !important;
            border-color: #2E4B2B;
            transform: translateY(-1px); /* 微弱的上浮效果 */
        }
        .stButton>button:active {
            background-color: #1B381A;
            transform: translateY(1px);
        }

        /* =================================
           6. 输入框优化 (核心修复区域)
           ================================= */
        /* 输入框容器背景 */
        input.st-ai, div[data-baseweb="input"], .stTextInput input, .stSelectbox input {
            background-color: #FAF8F0 !important; /* 浅米白背景 */
            border-color: #8FBC8F !important;
        }

        /* ⬇️ [核心修复]：强制输入文字和光标为黑色/深褐色 */
        /* 解决了“白色背景覆盖输入值”的问题 */
        input[type="text"] {
            color: #2E2E2E !important;        /* 输入的字变成深灰几近黑 */
            -webkit-text-fill-color: #2E2E2E !important; /* 兼容 Safari/Chrome */
            caret-color: #000000 !important;  /* 光标变成纯黑 */
        }

        /* 聚焦时的边框高亮 */
        div[data-baseweb="input"]:focus-within {
            border-color: #4A6A45 !important;
            box-shadow: 0 0 0 1px #4A6A45 !important;
        }

        /* =================================
           7. 多选框标签 (Multiselect Tags) 优化
           ================================= */
        /* Streamlit 默认是红色的，这里强制改为“麦穗黄” */
        span[data-baseweb="tag"] {
            background-color: #DCC865 !important; /* 温暖的麦穗黄 */
            color: #3E2723 !important;             /* 深褐色的文字 */
            border: 1px solid #B0A268 !important;  /* 稍微深一点的边框 */
        }

        /* 标签上的那个小叉叉 (删除按钮) */
        span[data-baseweb="tag"] svg {
            fill: #3E2723 !important;
        }

        /* =================================
           8. 提示框样式 (Alerts)
           ================================= */
        div[data-testid="stAlert"] {
            background-color: #F0E9CC !important;
            border: 1px solid #D7C6A5 !important;
            border-left: 5px solid #8B6A3E !important;
            border-radius: 6px !important;
        }
        div[data-testid="stAlert"] p {
            color: #000000 !important; 
        }
        div[data-testid="stAlert"] strong {
            color: #78B50E !important;  
            font-weight: 900 !important;
            text-shadow: 1px 1px 0px rgba(0,0,0,0.2);
        }
        div[data-testid="stAlert"] code {
            background-color: rgba(139, 106, 62, 0.15) !important;
            color: #3E2723 !important;
            border: 1px solid #C7B299 !important;
            border-radius: 4px;
        }

        /* 9. 顶部Header条透明化 */
        header[data-testid="stHeader"] {
            background-color: rgba(0,0,0,0);
        }
    </style>
    """, unsafe_allow_html=True)