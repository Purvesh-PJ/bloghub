import { CgLogOut } from "react-icons/cg";
import { 
    ChartSpline, 
    SquarePen, 
    Settings2, 
    TableOfContents, 
    Users, 
    Tags,
    Flag,
    AlertTriangle,
    BarChart4
} from 'lucide-react';



export const AdminSidePanelData = [
    {
        "category" : "DASHBOARD",
        "items": [
            {
                "id": 1,
                "itemName": "Analytics",
                "location": "Dashboard",
                "icon" : <ChartSpline size={16} strokeWidth={2} />
            }
        ]
    },
    {
        "category" : "CONTENT MANAGEMENT",
        "items": [
            {
                "id": 1,
                "itemName": "Create Post",
                "location": "AddBlogPost",
                "icon" : <SquarePen size={16} strokeWidth={2} />
            },
            {
                "id": 2,
                "itemName": "Manage Content",
                "location": "ManageData",
                "icon" : <TableOfContents size={16} strokeWidth={2} />
            },
            {
                "id": 3,
                "itemName": "Categories & Tags",
                "location": "Categories",
                "icon" : <Tags size={16} strokeWidth={2} />
            }
        ]
    },
    {
        "category" : "USER MANAGEMENT",
        "items": [
            {
                "id": 1,
                "itemName": "Manage Users",
                "location": "ManageUsers",
                "icon" : <Users size={16} strokeWidth={2} />
            },
            {
                "id": 2,
                "itemName": "User Activity",
                "location": "UserActivity",
                "icon" : <BarChart4 size={16} strokeWidth={2} />
            }
        ]
    },
    {
        "category" : "MODERATION",
        "items": [
            {
                "id": 1,
                "itemName": "Reports",
                "location": "Reports",
                "icon" : <Flag size={16} strokeWidth={2} />
            },
            {
                "id": 2,
                "itemName": "Moderation Log",
                "location": "ModerationLog",
                "icon" : <AlertTriangle size={16} strokeWidth={2} />
            }
        ]
    },
    {
        "category" : "CONFIGURATION",
        "items": [
            {
                "id": 1,
                "itemName": "Settings",
                "location": "Settings",
                "icon" : <Settings2 size={16} strokeWidth={2} />
            },
            {
                "id": 2,
                "itemName": "Logout",
                "location": "/",
                "icon" : <CgLogOut />
            }
        ]
    }
];
