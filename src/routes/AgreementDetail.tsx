import { useParams, Link, useNavigate } from 'react-router-dom';
import { trpc } from '@/trpc/client';

const api = trpc as any;

export default function AgreementDetail() {
  const { forestFileId } = useParams<{ forestFileId: string }>();
  const navigate = useNavigate();

  const { data: agreement, isLoading, refetch } = api.agreement.byId.useQuery({ forestFileId: forestFileId || '' });
  const retireMutation = api.agreement.retire.useMutation({
    onSuccess: () => refetch(),
  });
  const unretireMutation = api.agreement.unretire.useMutation({
    onSuccess: () => refetch(),
  });

  const handleRetire = async () => {
    if (confirm('Are you sure you want to retire this agreement?')) {
      await retireMutation.mutateAsync({ forestFileId: forestFileId || '' });
    }
  };

  const handleUnretire = async () => {
    await unretireMutation.mutateAsync({ forestFileId: forestFileId || '' });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!agreement) {
    return <div className="p-8 text-center">Agreement not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agreement.forestFileId}</h1>
          <p className="text-gray-500">
            {agreement.zone?.district?.description} / {agreement.zone?.description}
          </p>
        </div>
        <div className="flex gap-2">
          {agreement.retired ? (
            <button
              type="button"
              onClick={handleUnretire}
              disabled={unretireMutation.isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {unretireMutation.isLoading ? 'Unretiring...' : 'Unretire'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRetire}
              disabled={retireMutation.isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {retireMutation.isLoading ? 'Retiring...' : 'Retire'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Agreement Details</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{agreement.agreementType?.description}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Exemption Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{agreement.exemptionStatus}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {agreement.agreementStartDate ? new Date(agreement.agreementStartDate).toLocaleDateString() : '-'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {agreement.agreementEndDate ? new Date(agreement.agreementEndDate).toLocaleDateString() : '-'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    {agreement.retired ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Retired
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">{new Date(agreement.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Plans ({agreement.plans?.length || 0})</h3>
              <Link
                to={`/plans?agreement=${agreement.forestFileId}`}
                className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
              >
                View All Plans
              </Link>
            </div>
            <div className="overflow-x-auto">
              {!agreement.plans || agreement.plans.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No plans found</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agreement.plans.map((plan: any) => (
                      <tr key={plan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{plan.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.status?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.creator?.givenName ? `${plan.creator.givenName} ${plan.creator.familyName || ''}` : '-'}
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

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Clients ({agreement.clientAgreements?.length || 0})
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {!agreement.clientAgreements || agreement.clientAgreements.length === 0 ? (
                <p className="text-sm text-gray-500">No clients linked</p>
              ) : (
                <ul className="space-y-3">
                  {agreement.clientAgreements.map((ca: any) => (
                    <li key={ca.clientId} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ca.client?.name}</p>
                        <p className="text-xs text-gray-500">{ca.clientType?.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Location</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">District</dt>
                  <dd className="text-sm text-gray-900">{agreement.zone?.district?.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Zone</dt>
                  <dd className="text-sm text-gray-900">{agreement.zone?.description}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
