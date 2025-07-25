import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { DashboardHeader } from "./DashboardHeader"

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <DashboardHeader />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}