import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  MapPin, 
  PlusCircle, 
  CheckCircle, 
  History, 
  Settings,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Location Management', href: '/locations', icon: MapPin },
  { name: 'Create Post', href: '/create-post', icon: PlusCircle },
  { name: 'Approved Posts', href: '/approved-posts', icon: CheckCircle },
  { name: 'Post History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col h-full">
        <div className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Zap className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </div>
  )
}