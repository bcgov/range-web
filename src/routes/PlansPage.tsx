import { Link, useSearchParams } from 'react-router-dom';
import { trpc } from '@/trpc/client';

const api = trpc as any;

export default function PlansPage() {
  const [searchParams] = useSearchParams();
  const agreementFilter = searchParams.get('agreement');
  const [statusFilter, setStatusFilter] = React.useState<string>('');

  const { data, isLoading } = api.plan.list.useQuery({
    limit: 50,
    agreementId: agreementFilter || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Plans {agreementFilter && <span className="text-gray-500">for {agreementFilter}</span>}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : data?.plans.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No plans found</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extension</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.plans.map((plan: any) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{plan.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        to={`/agreements/${plan.agreement?.forestFileId}`}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        {plan.agreement?.forestFileId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.status?.code === 'A'
                            ? 'bg-green-100 text-green-800'
                            : plan.status?.code === 'R'
                              ? 'bg-red-100 text-red-800'
                              : plan.status?.code === 'RE'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {plan.status?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.extensionStatus ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          {plan.extensionStatus}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link to={`/plans/${plan.id}`} className="text-emerald-600 hover:text-emerald-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
