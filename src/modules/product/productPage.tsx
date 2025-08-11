import { Outlet, Route, Routes } from 'react-router-dom';
import ConfigureTermsCreate from './attributes/configure-terms/create';
import ConfigureTermsList from './attributes/configure-terms/list';
import AttributeCreate from './attributes/create';
import AttributeList from './attributes/list';
import BrandCreate from './brands/Create';
import BrandList from './brands/List';
import Categories from './categories/list/List';
import ProductCreate from './create/createProduct';
import ProductList from './list/List';
import TagLIst from './tag/list';
import CategoryCreate from './categories/create';
import TagCreate from './tag/create';

const ProductPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route path="/" element={<ProductList />} />
      <Route path="/add-product" element={<ProductCreate />} />
      <Route path="/edit/:id" element={<ProductCreate />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/add" element={<CategoryCreate />} />
      <Route path="/category/edit/:id" element={<CategoryCreate />} />
      <Route path="/tag/edit/:id" element={<TagCreate />} />
      <Route path="/tags" element={<TagLIst />} />
      <Route path="/tags/add" element={<TagCreate />} />
      <Route path="/attributes" element={<AttributeList />} />
      <Route path="/attributes/create" element={<AttributeCreate />} />
      <Route path="/attributes/edit/:id" element={<AttributeCreate />} />
      <Route
        path="/attributes/configure-terms"
        element={<ConfigureTermsList />}
      />
      <Route
        path="/attributes/configure-terms/create"
        element={<ConfigureTermsCreate />}
      />

      <Route path="/brands" element={<BrandList />} />
      <Route path="/brands/create" element={<BrandCreate />} />
      <Route path="/brands/edit/:id" element={<BrandCreate />} />

      {/* <Route path="/size-guides" element={<SizeGuideList />} />
      <Route path="/size-guides/create" element={<SizeGuideCreate />} /> */}
    </Route>
  </Routes>
);

export default ProductPage;
