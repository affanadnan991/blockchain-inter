'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import TokenManagement from '@/components/admin/TokenManagement'

export default function AdminTokensPage() {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <TokenManagement />
            </div>
        </AdminLayout>
    )
}
