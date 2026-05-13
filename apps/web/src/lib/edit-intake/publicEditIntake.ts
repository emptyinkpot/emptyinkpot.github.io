export type PublicEditIntakeClass = 'annotation' | 'edit_proposal' | 'moderation' | 'interaction';

export type PublicEditIntent =
  | 'comment'
  | 'highlight'
  | 'rewrite_block'
  | 'insert_asset_block'
  | 'moderate_comment'
  | 'reader_state';

export type PublicEditTargetType = 'document' | 'section' | 'block' | 'inline_range' | 'asset_slot';

export type PublicEditResultType = 'annotation' | 'graph_edit_operation' | 'moderation_state' | 'runtime_state';

export type ProjectionEditContext = {
  graphId: string;
  graphVersionId: string;
  packageId: string;
  route: string;
  surface: 'myblog';
};

export type PublicEditAnchor = {
  anchorId: string;
  targetType: PublicEditTargetType;
  blockId?: string;
  sectionId?: string;
  selector?: string;
  text?: string;
};

export type PublicEditDraft = {
  intakeClass: PublicEditIntakeClass;
  intent: PublicEditIntent;
  target: PublicEditAnchor;
  body: string;
  actor: {
    actorType: 'owner' | 'public_user' | 'anonymous';
    displayName?: string;
  };
  clientState?: Record<string, unknown>;
};

export type PublicEditIntake = {
  schemaVersion: 'public-edit-intake.v1';
  id: string;
  status: 'captured' | 'needs_review';
  createdAt: string;
  source: {
    repository: 'MyBlog';
    surface: 'public_projection';
    route: string;
    packageId: string;
  };
  graphRef: {
    graphId: string;
    graphVersionId: string;
  };
  intake: {
    class: PublicEditIntakeClass;
    intent: PublicEditIntent;
    target: PublicEditAnchor;
    body: string;
    actor: PublicEditDraft['actor'];
    clientState?: Record<string, unknown>;
  };
  reviewPolicy: {
    required: boolean;
    allowedResultTypes: PublicEditResultType[];
  };
};

export function createPublicEditIntake(
  context: ProjectionEditContext,
  draft: PublicEditDraft,
  now = new Date()
): PublicEditIntake {
  const reviewPolicy = getReviewPolicy(draft.intakeClass);

  return {
    schemaVersion: 'public-edit-intake.v1',
    id: createIntakeId(draft.intent, now),
    status: reviewPolicy.required ? 'needs_review' : 'captured',
    createdAt: now.toISOString(),
    source: {
      repository: 'MyBlog',
      surface: 'public_projection',
      route: context.route,
      packageId: context.packageId
    },
    graphRef: {
      graphId: context.graphId,
      graphVersionId: context.graphVersionId
    },
    intake: {
      class: draft.intakeClass,
      intent: draft.intent,
      target: draft.target,
      body: draft.body,
      actor: draft.actor,
      clientState: draft.clientState
    },
    reviewPolicy
  };
}

function getReviewPolicy(intakeClass: PublicEditIntakeClass): PublicEditIntake['reviewPolicy'] {
  if (intakeClass === 'edit_proposal') {
    return {
      required: true,
      allowedResultTypes: ['graph_edit_operation']
    };
  }

  if (intakeClass === 'moderation') {
    return {
      required: true,
      allowedResultTypes: ['moderation_state']
    };
  }

  if (intakeClass === 'interaction') {
    return {
      required: false,
      allowedResultTypes: ['runtime_state']
    };
  }

  return {
    required: false,
    allowedResultTypes: ['annotation']
  };
}

function createIntakeId(intent: PublicEditIntent, now: Date) {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `pei_${intent}_${now.getTime().toString(36)}_${randomPart}`;
}
