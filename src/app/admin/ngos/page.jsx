'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import NGOManagement from '@/components/admin/NGOManagement'

export default function AdminNGOsPage() {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <NGOManagement />
            </div>
        </AdminLayout>
    )
}
