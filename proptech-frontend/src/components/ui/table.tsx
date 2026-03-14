import React from 'react';

export const Table = ({ children, className = '' }: any) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHeader = ({ children }: any) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody = ({ children }: any) => <tbody>{children}</tbody>;

export const TableRow = ({ children }: any) => (
  <tr className="border-b">{children}</tr>
);

export const TableHead = ({ children }: any) => (
  <th className="p-2 text-left font-medium">{children}</th>
);

export const TableCell = ({ children }: any) => <td className="p-2">{children}</td>;

