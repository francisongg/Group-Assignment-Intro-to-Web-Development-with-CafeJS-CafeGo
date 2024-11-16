<h1>Transaction History</h1>
<% if (transactions.length === 0) { %>
    <p>No transactions yet.</p>
<% } else { %>
    <% transactions.forEach(tx => { %>
        <div>
            <h3>Transaction ID: <%= tx.transaction_id %></h3>
            <p>Created At: <%= tx.created_at %></p>
            <p>Product ID: <%= tx.product_id %>, Quantity: <%= tx.quantity %></p>
        </div>
    <% }) %>
<% } %>
