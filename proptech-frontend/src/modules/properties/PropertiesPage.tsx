import React from 'react';
import { IconSearch, IconPlus } from '@/components/icons/Icons';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { CreatePropertyDialog } from '@/components/properties/CreatePropertyDialog';
import { useProperties } from '@/hooks/useProperties';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useAuth } from '@/hooks/useAuth';

export const PropertiesPage: React.FC = () => {
  const { properties, loading, error, refetch } = useProperties();
  const { user } = useAuth();
  const [search, setSearch] = React.useState('');

  const isManager = user?.role === 'MANAGER';

  const filtered = properties.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full flex-1 sm:w-auto">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        {isManager && (
          <CreatePropertyDialog onCreated={refetch}>
            <Button>
              <IconPlus className="mr-2 h-4 w-4 shrink-0" />
              Add Property
            </Button>
          </CreatePropertyDialog>
        )}
      </div>

      <Card>
        <CardContent className="p-4">
          {loading && properties.length === 0 ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No properties found
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

