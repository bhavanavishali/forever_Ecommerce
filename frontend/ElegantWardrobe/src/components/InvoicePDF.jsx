import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#333',
  },
  // Header Section
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  companySection: {
    flex: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  companyTagline: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  invoiceSection: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#666',
  },
  
  // Info Section
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoSection: {
    flex: 1,
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 3,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  
  // Address Section
  addressContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 25,
    borderRadius: 4,
  },
  
  // Table Styles
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d3d3d3',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRowAlt: {
    backgroundColor: '#f8f8f8',
  },
  tableCol: {
    flex: 1,
    fontSize: 10,
    color: '#333',
  },
  tableColWide: {
    flex: 2,
  },
  tableColPrice: {
    textAlign: 'right',
  },
  
  // Totals Section
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalsSection: {
    width: 300,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
  },
  totalsHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  totalsHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalRowFinal: {
    backgroundColor: '#000',
    borderBottomWidth: 0,
  },
  totalLabel: {
    fontSize: 11,
    color: '#333',
  },
  totalLabelFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValueFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  
  // Footer
  footer: {
    marginTop: 60,
    paddingTop: 30,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  footerBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

const InvoicePDF = ({ order, websiteName = "Forever" }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header with Company Name and Invoice Title */}
      <View style={styles.headerContainer}>
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{websiteName}</Text>
          <Text style={styles.companyTagline}>Premium Quality Products</Text>
        </View>
        <View style={styles.invoiceSection}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceNumber}>#{order.order_no}</Text>
        </View>
      </View>

      {/* Order Information and Status */}
      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.infoText}>
            Order Date: <Text style={styles.boldText}>{order.order_date}</Text>
          </Text>
          <Text style={styles.infoText}>
            Status: <Text style={styles.boldText}>{order.status}</Text>
          </Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <Text style={styles.infoText}>
            Method: <Text style={styles.boldText}>{order.payment_method}</Text>
          </Text>
          <Text style={styles.infoText}>
            Status: <Text style={styles.boldText}>{order.payment_status}</Text>
          </Text>
        </View>
      </View>

      {/* Shipping Address */}
      <View style={styles.addressContainer}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={[styles.infoText, styles.boldText]}>{order?.address?.name}</Text>
        <Text style={styles.infoText}>{order?.address?.street_address}</Text>
        <Text style={styles.infoText}>
          {order?.address?.city}, {order?.address?.state} - {order?.address?.pin_code}
        </Text>
        <Text style={styles.infoText}>{order?.address?.country}</Text>
        <Text style={styles.infoText}>Phone: {order?.address?.phone_no}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.tableCol, styles.tableColWide]}>
            Product
          </Text>
          <Text style={[styles.tableHeaderText, styles.tableCol]}>Size</Text>
          <Text style={[styles.tableHeaderText, styles.tableCol]}>Color</Text>
          <Text style={[styles.tableHeaderText, styles.tableCol]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.tableCol]}>Unit Price</Text>
          <Text style={[styles.tableHeaderText, styles.tableCol]}>Total</Text>
        </View>

        {order?.items?.map((item, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
            <Text style={[styles.tableCol, styles.tableColWide]}>{item.product_name}</Text>
            <Text style={styles.tableCol}>{item.variant.size}</Text>
            <Text style={styles.tableCol}>{item.variant.color}</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={[styles.tableCol, styles.tableColPrice]}>
              ₹{(item.price / item.quantity).toFixed(2)}
            </Text>
            <Text style={[styles.tableCol, styles.tableColPrice]}>
              ₹{item.price.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Professional Totals Section */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsSection}>
          <View style={styles.totalsHeader}>
            <Text style={styles.totalsHeaderText}>Order Summary</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₹{order.total_price}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Offer Discount</Text>
            <Text style={styles.totalValue}>-₹{order.total_discount}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Coupon Discount ({order.coupon_discount}%)</Text>
            <Text style={styles.totalValue}>
              -₹{((order.total_price - order.total_discount) * (order.coupon_discount / 100)).toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalLabelFinal}>Final Amount</Text>
            <Text style={styles.totalValueFinal}>₹{order.final_amount}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerBold}>Thank you for choosing {websiteName}!</Text>
        <Text style={styles.footerText}>
          We appreciate your business and hope you enjoy your purchase.
        </Text>
        <Text style={styles.footerText}>
          For support, please contact us through our website or customer service.
        </Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;


