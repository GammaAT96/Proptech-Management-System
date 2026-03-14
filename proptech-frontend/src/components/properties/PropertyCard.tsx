import React from 'react';
import { IconBuilding, IconHome, IconMoreVertical, IconEye, IconEdit, IconTrash } from '@/components/icons/Icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Property } from '@/types/property.types';
import { useAuth } from '@/hooks/useAuth';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { user } = useAuth();
  const isManager = user?.role === 'MANAGER';

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <IconBuilding className="h-6 w-6 shrink-0 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{property.name}</CardTitle>
              <CardDescription className="text-xs">
                {property.units} units
              </CardDescription>
            </div>
          </div>
          {isManager && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconMoreVertical className="h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <IconEye className="mr-2 h-4 w-4 shrink-0" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconEdit className="mr-2 h-4 w-4 shrink-0" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <IconTrash className="mr-2 h-4 w-4 shrink-0" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <IconHome className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{property.address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

