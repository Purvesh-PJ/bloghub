// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';

const UserAnalyticsData = [
    { 
        id: 1,
        title : 'Total Posts',
        Analytics : 100,
        Icon :<ArticleIcon /> ,
    },
    { 
        id: 2,
        title : 'Total Views',
        Analytics : 120, 
        Icon : <VisibilityIcon/>,
    },
    { 
        id: 3,
        title : 'Total Likes',
        Analytics : 50, 
        Icon : <ThumbUpAltIcon/>, 
    },
    { 
        id: 4,
        title : 'Total Shares',
        Analytics: 150, 
        Icon : <ShareIcon/> ,
    },
]

export default UserAnalyticsData;