
# Gnome Images

This directory contains gnome images used throughout the application.

## Image Types
- `gnome_presentation.png` - Gnome with presentation/chart
- `gnome_clipboard.png` - Gnome with clipboard
- `gnome_welcome.png` - Gnome with open arms
- `gnome_magnifying.png` - Gnome with magnifying glass
- `gnome_charts.png` - Gnome with charts/analytics
- `gnome_profile.png` - Gnome portrait style
- `gnome_report.png` - Gnome with report/document
- `gnome_analysis.png` - Gnome analyzing data
- `placeholder.svg` - Fallback image (already included)

## Usage

Use the `GnomeImage` component for consistent display of gnome images:

```tsx
import GnomeImage from '@/components/common/GnomeImage';

// By type
<GnomeImage type="presentation" />

// By archetype ID
<GnomeImage archetypeId="a1" />

// By section type
<GnomeImage sectionType="cost-analysis" />
```

Alternatively, access image paths directly:

```tsx
import { gnomeImages } from '@/utils/gnomeImages';

<img src={gnomeImages.presentation} alt="Gnome" />
```
