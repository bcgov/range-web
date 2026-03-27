import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Plan {
  id: number;
  rangeName?: string;
  planStartDate?: string;
  planEndDate?: string;
  extensionStatus?: number;
  notes?: string;
  createdAt: string;
  status?: { code: string; name: string };
  agreement?: {
    forestFileId: string;
    zone?: {
      description?: string;
      district?: { name?: string };
    };
    clientAgreements?: { clientId: string; client?: { name?: string } }[];
  };
  creator?: { username: string; givenName?: string; familyName?: string };
  pastures?: { id: number; name?: string; acres?: number; plantCommunities?: { id: number }[] }[];
}

interface StatusHistoryEntry {
  id: number;
  toPlanStatusId: number;
  note?: string;
  createdAt: string;
}

export default function PlanDetail() {
  const { planId } = useParams<{ planId: string }>();
  const { token } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!token || !planId) return;

      setIsLoading(true);
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [planRes, historyRes] = await Promise.all([
          fetch(`/api/trpc/plan.byId?input=${encodeURIComponent(JSON.stringify({ id: Number(planId) }))}`, { headers }),
          fetch(
            `/api/trpc/plan.statusHistory?input=${encodeURIComponent(JSON.stringify({ planId: Number(planId) }))}`,
            { headers },
          ),
        ]);

        const planData = await planRes.json();
        const historyData = await historyRes.json();

        if (planData.result?.data) {
          setPlan(planData.result.data);
        } else {
          setError('Plan not found');
        }

        if (historyData.result?.data) {
          setStatusHistory(historyData.result.data);
        }
      } catch (err) {
        console.error('Failed to fetch plan:', err);
        setError('Failed to load plan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [token, planId]);

  const getStatusColor = (code?: string) => {
    switch (code) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'R':
        return 'bg-red-100 text-red-800';
      case 'RE':
        return 'bg-gray-100 text-gray-800';
      case 'S':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error || 'Plan not found'}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan #{plan.id}</h1>
          <p className="text-gray-500">
            Agreement:{' '}
            <Link
              to={`/agreements/${plan.agreement?.forestFileId}`}
              className="text-emerald-600 hover:text-emerald-900"
            >
              {plan.agreement?.forestFileId}
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-2 text-sm font-semibold rounded-md ${getStatusColor(plan.status?.code)}`}>
            {plan.status?.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Plan Details</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Plan ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">#{plan.id}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Range Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{plan.rangeName || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Plan Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {plan.planStartDate ? new Date(plan.planStartDate).toLocaleDateString() : '-'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Plan End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {plan.planEndDate ? new Date(plan.planEndDate).toLocaleDateString() : '-'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Extension Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{plan.extensionStatus || '-'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(plan.createdAt).toLocaleDateString()}</dd>
                </div>
                {plan.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">{plan.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Pastures ({(plan.pastures as Plan['pastures'])?.length || 0})
              </h3>
            </div>
            <div className="overflow-x-auto">
              {!plan.pastures || plan.pastures.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No pastures defined</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acres</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Plant Communities
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plan.pastures.map((pasture) => (
                      <tr key={pasture.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pasture.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pasture.acres || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(pasture as any).plantCommunities?.length || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Status History</h3>
            </div>
            <div className="overflow-x-auto">
              {statusHistory.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No status history</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {statusHistory.map((entry) => (
                    <div key={entry.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Status changed to ID {entry.toPlanStatusId}
                          </p>
                          {entry.note && <p className="text-sm text-gray-500">{entry.note}</p>}
                        </div>
                        <div className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Agreement Info</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Zone</dt>
                  <dd className="text-sm text-gray-900">{plan.agreement?.zone?.description || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">District</dt>
                  <dd className="text-sm text-gray-900">{plan.agreement?.zone?.district?.name || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Clients</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {!plan.agreement?.clientAgreements || plan.agreement.clientAgreements.length === 0 ? (
                <p className="text-sm text-gray-500">No clients</p>
              ) : (
                <ul className="space-y-2">
                  {plan.agreement.clientAgreements.map((ca) => (
                    <li key={ca.clientId} className="text-sm text-gray-900">
                      {ca.client?.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Creator</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-900">
                {plan.creator?.givenName || ''} {plan.creator?.familyName || ''} ({plan.creator?.username})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
