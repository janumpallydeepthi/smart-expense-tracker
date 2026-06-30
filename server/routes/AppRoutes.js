import EditExpense from "../pages/EditExpense";

// ... inside Routes:
<Route
  path="/edit-expense/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <EditExpense />
      </Layout>
    </ProtectedRoute>
  }
/>