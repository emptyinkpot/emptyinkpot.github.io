import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import type { PartialBlock } from '@blocknote/core';
import { useMemo, useState } from 'react';
import {
  createPublicEditIntake,
  type ProjectionEditContext,
  type PublicEditDraft,
  type PublicEditIntake
} from '../../lib/edit-intake/publicEditIntake';

const projectionContext: ProjectionEditContext = {
  graphId: 'graph.example.epub',
  graphVersionId: 'graph.example.epub.v2',
  packageId: 'projection.package.example.html',
  route: '/edit-intake/',
  surface: 'myblog'
};

const sampleAnchor = {
  anchorId: 'anchor.example.evidence',
  targetType: 'block' as const,
  blockId: 'blk.example.evidence',
  selector: '#evidence-1',
  text: 'Evidence is a graph node target.'
};

const initialContent: PartialBlock[] = [
  {
    type: 'heading',
    props: { level: 2 },
    content: 'Editable projection shell'
  },
  {
    type: 'paragraph',
    content:
      'This page is a MyBlog-side editing surface. The editable document below is not canonical truth; it is only UI state used to produce DataBase public-edit-intake records.'
  },
  {
    type: 'paragraph',
    content:
      'Try changing this block, then emit a comment, rewrite proposal, or illustration proposal. The resulting JSON is the boundary artifact.'
  }
];

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function makeDraft(kind: 'comment' | 'rewrite' | 'asset', documentSnapshot: unknown): PublicEditDraft {
  if (kind === 'rewrite') {
    return {
      intakeClass: 'edit_proposal',
      intent: 'rewrite_block',
      target: sampleAnchor,
      body: 'Rewrite this block after review; do not mutate the canonical graph from MyBlog.',
      actor: {
        actorType: 'owner',
        displayName: 'emptyinkpot'
      },
      clientState: {
        editor: 'BlockNote',
        documentSnapshot
      }
    };
  }

  if (kind === 'asset') {
    return {
      intakeClass: 'edit_proposal',
      intent: 'insert_asset_block',
      target: {
        ...sampleAnchor,
        targetType: 'asset_slot'
      },
      body: 'Propose an illustration asset linked to this block. The original source artifact remains immutable.',
      actor: {
        actorType: 'owner',
        displayName: 'emptyinkpot'
      },
      clientState: {
        editor: 'BlockNote',
        assetPolicy: 'proposal-only',
        documentSnapshot
      }
    };
  }

  return {
    intakeClass: 'annotation',
    intent: 'comment',
    target: sampleAnchor,
    body: 'Reader-visible comment captured as an Annotation Graph overlay.',
    actor: {
      actorType: 'public_user',
      displayName: 'projection reader'
    },
    clientState: {
      editor: 'BlockNote',
      documentSnapshot
    }
  };
}

export default function EditIntakeWorkbench() {
  const editor = useCreateBlockNote({ initialContent });
  const [documentSnapshot, setDocumentSnapshot] = useState(() => editor.document);
  const [intake, setIntake] = useState<PublicEditIntake>(() =>
    createPublicEditIntake(projectionContext, makeDraft('comment', editor.document))
  );

  const contextJson = useMemo(() => formatJson(projectionContext), []);
  const intakeJson = useMemo(() => formatJson(intake), [intake]);
  const documentJson = useMemo(() => formatJson(documentSnapshot), [documentSnapshot]);

  const emitIntake = (kind: 'comment' | 'rewrite' | 'asset') => {
    const snapshot = editor.document;
    setDocumentSnapshot(snapshot);
    setIntake(createPublicEditIntake(projectionContext, makeDraft(kind, snapshot)));
  };

  return (
    <main className="edit-intake-page">
      <section className="edit-intake-hero" aria-labelledby="edit-intake-title">
        <div>
          <p>MyBlog projection surface</p>
          <h1 id="edit-intake-title">Public edit intake</h1>
        </div>
        <dl>
          <div>
            <dt>Boundary</dt>
            <dd>public-edit-intake.v1</dd>
          </div>
          <div>
            <dt>Truth owner</dt>
            <dd>DataBase</dd>
          </div>
          <div>
            <dt>Editor role</dt>
            <dd>UI substrate</dd>
          </div>
        </dl>
      </section>

      <section className="edit-intake-grid" aria-label="Editable intake workbench">
        <article className="edit-intake-panel edit-intake-panel--editor">
          <header className="edit-intake-panel__head">
            <div>
              <p>Editable projection</p>
              <h2>BlockNote shell</h2>
            </div>
            <span>not canonical AST</span>
          </header>
          <BlockNoteView
            editor={editor}
            theme="light"
            onChange={() => setDocumentSnapshot(editor.document)}
          />
          <div className="edit-intake-actions" aria-label="Emit intake examples">
            <button type="button" onClick={() => emitIntake('comment')}>
              Comment
            </button>
            <button type="button" onClick={() => emitIntake('rewrite')}>
              Rewrite proposal
            </button>
            <button type="button" onClick={() => emitIntake('asset')}>
              Illustration proposal
            </button>
          </div>
        </article>

        <aside className="edit-intake-panel edit-intake-panel--artifact">
          <header className="edit-intake-panel__head">
            <div>
              <p>Boundary artifact</p>
              <h2>Generated intake JSON</h2>
            </div>
            <span>{intake.status}</span>
          </header>
          <pre className="edit-intake-code">{intakeJson}</pre>
        </aside>

        <aside className="edit-intake-panel edit-intake-panel--context">
          <header className="edit-intake-panel__head">
            <div>
              <p>Projection context</p>
              <h2>Current package ref</h2>
            </div>
          </header>
          <pre className="edit-intake-code">{contextJson}</pre>
        </aside>

        <aside className="edit-intake-panel edit-intake-panel--snapshot">
          <header className="edit-intake-panel__head">
            <div>
              <p>UI state</p>
              <h2>BlockNote snapshot</h2>
            </div>
          </header>
          <pre className="edit-intake-code">{documentJson}</pre>
        </aside>
      </section>
    </main>
  );
}
