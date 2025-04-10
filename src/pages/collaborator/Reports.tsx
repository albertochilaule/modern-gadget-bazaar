
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CollaboratorReports = () => {
  const salesData = [
    { month: 'Jan', vendas: 4000 },
    { month: 'Fev', vendas: 3000 },
    { month: 'Mar', vendas: 5000 },
    { month: 'Abr', vendas: 4500 },
    { month: 'Mai', vendas: 6000 },
    { month: 'Jun', vendas: 5500 },
  ];

  const categoryData = [
    { name: 'Laptops', value: 45 },
    { name: 'Desktops', value: 28 },
    { name: 'Smartphones', value: 18 },
    { name: 'Acessórios', value: 9 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vendas nos Últimos 6 Meses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="vendas" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaboratorReports;
