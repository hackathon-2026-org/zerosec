import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# Create high-res dashboard preview
fig = plt.figure(figsize=(10, 5.5), dpi=200, facecolor='#090d16')
ax = fig.add_subplot(111)
ax.set_facecolor('#090d16')
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Header Bar
ax.add_patch(patches.FancyBboxPatch((2, 88), 96, 10, facecolor='#111827', edgecolor='#1f293d', linewidth=1, boxstyle="round,pad=0.5"))
ax.text(5, 93.5, "ZeroSec", color='#ffffff', fontsize=14, fontweight='bold', va='center')
ax.text(17, 93.5, "|  Campaign Anomaly Intelligence (PS-04)", color='#94a3b8', fontsize=10, va='center')
ax.text(92, 93.5, "● ACTIVE", color='#10b981', fontsize=9, fontweight='bold', ha='right', va='center')

# 4 Top KPI Cards
kpis = [
    ("MONITORED", "20 Campaigns", "#38bdf8", 2),
    ("TOTAL SPEND", "Rs 1,24,50,000", "#10b981", 26.5),
    ("ACTIONABLE ALERTS", "5 Incidents", "#f43f5e", 51),
    ("CATCH RATE", "100% Recall (0 Missed)", "#a855f7", 75.5)
]
for title, val, col, x in kpis:
    ax.add_patch(patches.FancyBboxPatch((x, 70), 22.5, 15, facecolor='#111827', edgecolor='#1f293d', boxstyle="round,pad=0.4"))
    ax.text(x + 2, 81, title, color='#64748b', fontsize=7, fontweight='bold')
    ax.text(x + 2, 74.5, val, color=col, fontsize=10, fontweight='bold')

# Left Panel: Anomaly Bands Time Series Chart
ax.add_patch(patches.FancyBboxPatch((2, 6), 58, 60, facecolor='#111827', edgecolor='#1f293d', boxstyle="round,pad=0.5"))
ax.text(5, 62, "Dynamic Rolling Baseline & Confidence Bands (mu +- 2*sigma)", color='#ffffff', fontsize=9, fontweight='bold')
ax.text(5, 59, "Campaign C01  |  14-Day Rolling Window  |  Metric: Conversions", color='#64748b', fontsize=7)

# Generate realistic time-series with anomaly
days = np.linspace(5, 56, 40)
np.random.seed(42)
baseline = 40 + 5 * np.sin(np.linspace(0, 3*np.pi, 40)) + np.random.normal(0, 1, 40)
upper = baseline + 8 + np.random.normal(0, 0.5, 40)
lower = np.maximum(5, baseline - 8 - np.random.normal(0, 0.5, 40))

observed = baseline.copy()
# Inject severe drop anomaly at index 28
observed[27:31] = [5, 4, 3, 6]

ax.fill_between(days, lower, upper, color='#6366f1', alpha=0.18, label='Dynamic Baseline Band')
ax.plot(days, baseline, color='#818cf8', linestyle='--', linewidth=1.2, label='Rolling Mean (mu)')
ax.plot(days, observed, color='#38bdf8', linewidth=1.8, label='Observed Daily Value')

# Highlight Anomaly Dot
ax.scatter([days[28]], [observed[28]], color='#f43f5e', s=80, zorder=5)
ax.annotate('CRITICAL ANOMALY\nConversion Tag Broken (Drop to 0)',
            xy=(days[28], observed[28]), xytext=(days[28]-12, observed[28]+18),
            arrowprops=dict(arrowstyle="->", color='#f43f5e', lw=1.2),
            color='#fda4af', fontsize=6.5, fontweight='bold',
            bbox=dict(boxstyle="round,pad=0.3", fc="#881337", ec="#f43f5e", lw=0.8))

# Right Panel: Ground-Truth Confusion Matrix & Benchmark
ax.add_patch(patches.FancyBboxPatch((62, 6), 36, 60, facecolor='#111827', edgecolor='#1f293d', boxstyle="round,pad=0.5"))
ax.text(64, 62, "Ground-Truth Evaluation (PS-04)", color='#ffffff', fontsize=9, fontweight='bold')
ax.text(64, 59, "180-Day Benchmark Dataset Performance", color='#64748b', fontsize=7)

# 4 Matrix cells
matrix_cells = [
    ("True Positives (TP)", "5 Incidents", "#059669", "#064e3b", 64, 44),
    ("False Negatives (FN)", "0 Missed", "#10b981", "#064e3b", 80.5, 44),
    ("False Positives (FP)", "24 Digest", "#d97706", "#78350f", 64, 28),
    ("True Negatives (TN)", "3,571 Quiet Days", "#2563eb", "#1e3a8a", 80.5, 28),
]
for title, val, text_col, bg_col, mx, my in matrix_cells:
    ax.add_patch(patches.FancyBboxPatch((mx, my), 15.5, 13, facecolor=bg_col, edgecolor=text_col, lw=0.8, boxstyle="round,pad=0.3"))
    ax.text(mx + 1, my + 9.5, title, color='#cbd5e1', fontsize=6, fontweight='bold')
    ax.text(mx + 1, my + 4, val, color=text_col, fontsize=9, fontweight='bold')

# Comparison Box
ax.add_patch(patches.FancyBboxPatch((64, 10), 32, 14, facecolor='#0f172a', edgecolor='#334155', boxstyle="round,pad=0.3"))
ax.text(65.5, 20.5, "VS NAIVE 30% THRESHOLD:", color='#94a3b8', fontsize=6.5, fontweight='bold')
ax.text(65.5, 16.5, "• Naive Rule: 1,103 False Alerts (1.4% Precision)", color='#f87171', fontsize=6)
ax.text(65.5, 12.5, "• ZeroSec: >97% Noise Reduction (100% Recall)", color='#4ade80', fontsize=6.5, fontweight='bold')

plt.tight_layout()
plt.savefig('D:\\Psg hackathon\\zerosec_dashboard_preview.png', bbox_inches='tight', dpi=250)
plt.close()
print("Dashboard preview graphic saved successfully!")
