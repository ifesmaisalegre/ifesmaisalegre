import Link from 'next/link';

export type ActivityCardData = {
  id: number | string;
  slug: string;
  name: string;
  category?: string | null;
  tone?: string | null;
  imageUrl?: string | null;
  photoUrl?: string | null;
  coverUrl?: string | null;
  requiresRegistration?: boolean;
};

export function ActivityCard({ activity }: { activity: ActivityCardData }) {
  const imageSrc =
    activity.imageUrl?.trim() ||
    activity.photoUrl?.trim() ||
    activity.coverUrl?.trim() ||
    '';

  const bgTone = activity.tone?.trim() || '#E6E9F8';

  return (
    <Link
      href={`/atividades/${activity.slug}`}
      className="tile-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 170,
          width: '100%',
          background: bgTone,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={activity.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#0F6B43',
              lineHeight: 1,
            }}
          >
            +
          </span>
        )}
      </div>

      <div style={{ padding: '14px 16px 16px', minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 8,
            overflowWrap: 'anywhere',
          }}
        >
          {activity.name}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {activity.category && (
            <span
              style={{
                fontSize: 12,
                padding: '3px 9px',
                borderRadius: 999,
                background: 'rgba(15, 107, 67, 0.1)',
                color: '#0F6B43',
                fontWeight: 600,
              }}
            >
              {activity.category}
            </span>
          )}
          {typeof activity.requiresRegistration === 'boolean' && (
            <span
              style={{
                fontSize: 12,
                padding: '3px 9px',
                borderRadius: 999,
                background: activity.requiresRegistration
                  ? 'rgba(249, 161, 0, 0.18)'
                  : 'rgba(15, 107, 67, 0.12)',
                color: 'var(--ink)',
                fontWeight: 600,
              }}
            >
              {activity.requiresRegistration ? 'Com inscrição' : 'Sem inscrição'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}