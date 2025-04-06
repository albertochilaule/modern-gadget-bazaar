
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const data = [
  { product: 'Dell XPS 15', sales: 45 },
  { product: 'MacBook Pro', sales: 38 },
  { product: 'Lenovo ThinkPad', sales: 32 },
];

const TopSellingProducts = () => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.product}>
                <TableCell>{item.product}</TableCell>
                <TableCell className="text-right">{item.sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;
