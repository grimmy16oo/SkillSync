import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Archive, ArrowDownToLine, FileText, Plus, Save, Send, Trash2, Upload, UserRound, X } from "lucide-react";
import { supabase } from "../lib/supabase.js";
import { getUserInitials, getUserName } from "../app/userProfile.js";

const BUCKET = "post-attachments";
const PENDING_KEY = "skillsync-pending-post-attachments";

function getPendingUploads() {
  try { return JSON.parse(window.localStorage.getItem(PENDING_KEY) || "[]"); }
  catch { return []; }
}

function savePendingUpload(upload) {
  const pending = getPendingUploads().filter(item => item.key !== upload.key);
  window.localStorage.setItem(PENDING_KEY, JSON.stringify([...pending, upload]));
}

function clearPendingUpload(key) {
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(getPendingUploads().filter(item => item.key !== key)));
}

function safeFilename(name) {
  return name.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/^\.+/, "").slice(-120) || "attachment";
}

function formatPostDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function DiscoverPosts({ searchQuery = "", user, sessionReady, startPost, startPostRole, onComposerOpened, onLogin, onSignup }) {
  const [posts, setPosts] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editorOpen, setEditorOpen] = useState(startPost);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postingRole, setPostingRole] = useState(startPostRole || "");
  const [postTitle, setPostTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [certificationContent, setCertificationContent] = useState("");
  const [relatedLinks, setRelatedLinks] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [interestedPostIds, setInterestedPostIds] = useState(() => new Set());
  const [profilePreview, setProfilePreview] = useState(null);

  const loadPosts = useCallback(async () => {
    if (!user || !supabase) return;
    const postsQuery = supabase.from("posts").select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    const [roleResult, postResult] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      postsQuery,
    ]);
    if (roleResult.error) {
      setError(`Couldn't load your assigned roles: ${roleResult.error.message}`);
      setLoading(false);
      return;
    }
    if (postResult.error) {
      setError(`Couldn't load posts: ${postResult.error.message}`);
      setLoading(false);
      return;
    }
    const nextPosts = postResult.data || [];
    setRoles((roleResult.data || []).map(item => item.role));
    setPosts(nextPosts);
    const postIds = nextPosts.map(post => post.post_id);
    const userIds = [...new Set(nextPosts.map(post => post.user_id))];
    const [attachmentResult, profileResult] = await Promise.all([
      postIds.length ? supabase.from("attachments").select("*").in("post_id", postIds) : Promise.resolve({ data: [], error: null }),
      userIds.length ? supabase.from("profiles").select("user_id,full_name,institution").in("user_id", userIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (attachmentResult.error) setError(`Posts loaded, but attachments couldn't be listed: ${attachmentResult.error.message}`);
    setAttachments(attachmentResult.data || []);
    if (profileResult.error) setError(`Posts loaded, but author names couldn't be loaded: ${profileResult.error.message}`);
    setProfiles(Object.fromEntries((profileResult.data || []).map(profile => [profile.user_id, profile])));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!sessionReady || !user) return undefined;
    let active = true;
    Promise.resolve().then(() => active && loadPosts());
    return () => { active = false; };
  }, [sessionReady, user, loadPosts]);

  const visiblePosts = posts.filter(post => post.user_id === user?.id);
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredPosts = visiblePosts.filter(post => {
    if (!normalizedSearch) return true;
    const author = profiles[post.user_id];
    const postAttachments = attachments.filter(item => item.post_id === post.post_id);
    return [post.description, post.posting_role, post.status, author?.full_name, author?.institution,
      ...postAttachments.map(item => item.original_name)]
      .filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedSearch);
  });

  const beginCreate = () => {
    if (!roles.includes("instructor")) {
      setError("Only instructor accounts can publish skill offers. Add the instructor role in Edit profile to continue.");
      return;
    }
    setEditingPostId(null);
    setPostingRole("instructor");
    setPostTitle(""); setCourseName(""); setDescription(""); setCertificationContent(""); setRelatedLinks(""); setFiles([]); setError(""); setNotice(""); setEditorOpen(true);
  };

  const beginEdit = post => {
    setEditingPostId(post.post_id);
    const certificationMatch = post.description.match(/\n\nCertification\/content: ([\s\S]*?)(?=\n\nRelated links: |$)/);
    const linksMatch = post.description.match(/\n\nRelated links: ([\s\S]*)$/);
    let cleanDescription = post.description;
    const courseMatch = cleanDescription.match(/^Course: ([^\n]*)\n?/i);
    const titleMatch = cleanDescription.match(/^Title: ([^\n]*)\n?/im);
    if (courseMatch) cleanDescription = cleanDescription.replace(courseMatch[0], "");
    if (titleMatch) cleanDescription = cleanDescription.replace(titleMatch[0], "");
    if (certificationMatch) cleanDescription = cleanDescription.replace(certificationMatch[0], '');
    if (linksMatch) cleanDescription = cleanDescription.replace(linksMatch[0], '');
    setDescription(cleanDescription);
    setCourseName(courseMatch?.[1] || "");
    setPostTitle(titleMatch?.[1] || "");
    setCertificationContent(certificationMatch?.[1] || '');
    setRelatedLinks(linksMatch?.[1] || '');
    setPostingRole(post.posting_role);
    setFiles([]); setError(""); setNotice(""); setEditorOpen(true);
  };

  useEffect(() => {
    if (!startPost || !sessionReady || !user || loading) return;
    onComposerOpened();
  }, [startPost, sessionReady, user, loading, onComposerOpened]);

  const handleFiles = event => {
    const chosen = [...event.target.files];
    setFiles(current => {
      const merged = [...current];
      for (const file of chosen) {
        if (!merged.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) merged.push(file);
      }
      return merged;
    });
    setError("");
    event.target.value = "";
  };

  const savePost = async event => {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      if (!user || !supabase) throw new Error("Sign in before creating a post.");
      const role = postingRole;
      if (!roles.includes(role)) throw new Error(`Your account doesn't have the ${role} role. Ask an administrator to assign it before posting.`);
      if (role !== "instructor") throw new Error("Only instructors can publish skill offers.");
      const postDescription = [
        `Course: ${courseName.trim()}`,
        `Title: ${postTitle.trim()}`,
        description.trim(),
        certificationContent.trim() && `Certification/content: ${certificationContent.trim()}`,
        relatedLinks.trim() && `Related links: ${relatedLinks.trim()}`,
      ].filter(Boolean).join('\n\n');
      if (!postDescription) throw new Error("Add a description before saving.");
      let postId = editingPostId;
      if (postId) {
        const { error: updateError } = await supabase.from("posts").update({ description: postDescription }).eq("post_id", postId).eq("user_id", user.id).eq("status", "draft");
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase.from("posts").insert({ user_id: user.id, posting_role: role, description: postDescription }).select("post_id").single();
        if (insertError) throw insertError;
        postId = data.post_id;
        setEditingPostId(postId);
      }

      for (const file of files) {
        const key = `${user.id}:${postId}:${file.name}:${file.size}:${file.lastModified}`;
        let pending = getPendingUploads().find(item => item.key === key);
        if (!pending) {
          pending = {
            key,
            postId,
            path: `${user.id}/${postId}/${crypto.randomUUID()}-${safeFilename(file.name)}`,
            originalName: file.name,
            mimeType: file.type,
            byteSize: file.size,
            uploaded: false,
          };
          savePendingUpload(pending);
        }
        if (!pending.uploaded) {
          const { error: uploadError } = await supabase.storage.from(BUCKET).upload(pending.path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
          if (uploadError) {
            const { data: existingFile } = await supabase.storage.from(BUCKET).download(pending.path);
            if (!existingFile) throw uploadError;
          }
          pending = { ...pending, uploaded: true };
          savePendingUpload(pending);
        }
        const { error: registerError } = await supabase.rpc("register_post_attachment", {
          p_post_id: postId,
          p_object_path: pending.path,
          p_original_name: pending.originalName,
        });
        if (registerError) throw new Error(`File uploaded but registration failed. Retry this draft to register ${file.name}: ${registerError.message}`);
        clearPendingUpload(key);
        setFiles(current => current.filter(item => !(item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)));
      }

      const intent = event.nativeEvent.submitter?.value || "draft";
      if (intent === "publish") {
        const { error: publishError } = await supabase.rpc("set_post_status", { p_post_id: postId, p_target_status: "published" });
        if (publishError) throw publishError;
      }
      setNotice(intent === "publish" ? "Post published." : "Draft saved.");
      setEditorOpen(false); setEditingPostId(null); setFiles([]);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Unable to save this post.");
      await loadPosts();
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (post, target) => {
    setError(""); setNotice("");
    const { error: statusError } = await supabase.rpc("set_post_status", { p_post_id: post.post_id, p_target_status: target });
    if (statusError) { setError(statusError.message); return; }
    setNotice(target === "published" ? "Post published." : "Post archived.");
    await loadPosts();
  };

  const removeAttachment = async attachment => {
    setError("");
    const { data, error: unregisterError } = await supabase.rpc("unregister_post_attachment", { p_attachment_id: attachment.attachment_id });
    if (unregisterError) { setError(unregisterError.message); return; }
    const row = Array.isArray(data) ? data[0] : data;
    const { error: storageError } = await supabase.storage.from(row?.bucket_id || BUCKET).remove([row?.object_path || attachment.object_path]);
    if (storageError) setError(`Attachment metadata was removed, but the storage file remains. Storage cleanup failed: ${storageError.message}`);
    await loadPosts();
  };

  const deleteDraft = async post => {
    setError("");
    const { error: deleteError } = await supabase.rpc("delete_draft_post", { p_post_id: post.post_id });
    if (deleteError) { setError(deleteError.message); return; }
    setNotice("Empty draft deleted.");
    await loadPosts();
  };

  const downloadAttachment = async attachment => {
    setError("");
    const { data, error: downloadError } = await supabase.storage.from(attachment.bucket_id || BUCKET).download(attachment.object_path);
    if (downloadError) { setError(`Couldn't download ${attachment.original_name}: ${downloadError.message}`); return; }
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url; link.download = attachment.original_name; link.click();
    URL.revokeObjectURL(url);
  };

  if (!sessionReady) return <section className="posts-page discover-posts"><p>Restoring your sign-in…</p></section>;
  if (!user) return (
    <section className="posts-page discover-posts posts-auth-gate">
      <FileText size={34} />
      <h1>Sign in to view skill posts</h1>
      <p>Posts are available to signed-in members only. Log in or create an account to continue.</p>
      <div><button onClick={onLogin}>Log in</button><button onClick={onSignup}>Create account</button></div>
    </section>
  );

  const attachmentFor = postId => attachments.filter(item => item.post_id === postId);

  return (
    <section className="posts-page discover-posts">
      <header className="posts-heading">
        <div><p>SKILL SHARING</p><h1>My Skill Offers</h1></div>
        <button className="posts-create-button" onClick={beginCreate}><Plus size={18} /> Offer a Skill</button>
      </header>
      {notice && <p className="posts-notice" role="status">{notice}</p>}
      {error && <p className="posts-error" role="alert"><AlertCircle size={16} />{error}</p>}
      {loading ? <section className="posts-skeleton-list" aria-label="Loading skill offers" aria-busy="true">{[0, 1, 2].map(item => <div className="posts-skeleton-card" key={item}><span /><div><i /><i /><i /></div></div>)}</section> : filteredPosts.length === 0 ? (
        <section className="posts-empty"><span className="posts-empty-icon"><FileText size={25} /></span><h2>{normalizedSearch ? "No posts match your search" : "Your skill offers will appear here"}</h2><p>{normalizedSearch ? "Try another skill, instructor, institution, or keyword." : "Share a skill or course to get started."}</p>{!normalizedSearch && <button onClick={beginCreate}><Plus size={16} /> Offer a Skill</button>}</section>      ) : (
        <section className="posts-list" aria-label="My skill offers">
          {filteredPosts.map(post => {
            const author = profiles[post.user_id];
            const attached = attachmentFor(post.post_id);
            const own = post.user_id === user.id;
            const descriptionLines = (post.description || '').split(/\r?\n/);
            const courseMatch = descriptionLines[0]?.trim().match(/^Course:\s*(.*)$/i);
            const titleMatch = (post.description || '').match(/^Title:\s*(.+)$/im);
            const legacyTitleIndex = courseMatch && !titleMatch ? descriptionLines.findIndex((line, index) => index > 0 && line.trim()) : -1;
            const postTitle = titleMatch?.[1]?.trim() || (legacyTitleIndex > 0 ? descriptionLines[legacyTitleIndex].trim() : '');
            let postBody = (post.description || '')
              .replace(/^Course:\s*[^\r\n]*(?:\r?\n)?/i, '')
              .replace(/^Title:\s*[^\r\n]*(?:\r?\n)?/im, '')
              .replace(/\n\nCertification\/content: [\s\S]*?(?=\n\nRelated links: |$)/, '')
              .replace(/\n\nRelated links: [\s\S]*$/, '')
              .trim();
            if (!titleMatch && legacyTitleIndex > 0) {
              const legacyTitle = descriptionLines[legacyTitleIndex].trim();
              postBody = postBody.replace(legacyTitle, '').trim();
            }
            const relatedLinksMatch = (post.description || '').match(/\n\nRelated links: ([\s\S]*)$/);
            const postLinks = relatedLinksMatch?.[1].split(/[\n,]+/).map(link => link.trim()).filter(Boolean) || [];
            return (
              <article className="skill-post-card" key={post.post_id}>
                <header><div><button className="post-author-link" type="button" onClick={() => setProfilePreview({ name: author?.full_name || (own ? getUserName(user) : "SkillSync member"), institution: author?.institution || "Institution not added", role: post.posting_role, userId: post.user_id })}>{author?.full_name || (own ? getUserName(user) : "SkillSync member")}</button><span>{author?.institution || ""}</span></div><div className="posts-meta"><span>{post.posting_role}</span>{post.status !== "published" && <span className={`post-status status-${post.status}`}>{post.status}</span>}<time>{new Date(post.created_at).toLocaleDateString()}</time></div></header>
                {courseMatch && <span className="post-course-chip">Course · {courseMatch[1].trim()}</span>}
                {postTitle && <h2 className="skill-post-title">{postTitle}</h2>}
                {postBody && <p className="skill-post-description">{postBody}</p>}
                {postLinks.length > 0 && <ul className="post-related-links">{postLinks.map(link => { let href; try { const parsed = new URL(link); if (["http:", "https:"].includes(parsed.protocol)) href = parsed.href; } catch { /* keep invalid URLs as plain text */ } return <li key={link}>{href ? <a href={href} target="_blank" rel="noreferrer">{link}</a> : link}</li> })}</ul>}
                {attached.length > 0 && <ul className="post-attachments">{attached.map(file => <li key={file.attachment_id}><FileText size={19} className="post-attachment-icon" /><span title={file.original_name}><strong>{file.original_name}</strong><small>{(file.byte_size / (1024 * 1024)).toFixed(2)} MiB</small></span><button onClick={() => downloadAttachment(file)} aria-label={`Download ${file.original_name}`}><ArrowDownToLine size={17} /></button>{own && post.status === "draft" && <button onClick={() => removeAttachment(file)} aria-label={`Remove ${file.original_name}`}><X size={16} /></button>}</li>)}</ul>}
                {post.status === "published" && !own && <footer><button type="button" className={interestedPostIds.has(post.post_id) ? "interest-sent" : ""} onClick={() => setInterestedPostIds(current => { const next = new Set(current); if (next.has(post.post_id)) next.delete(post.post_id); else next.add(post.post_id); return next; })}><Send size={15} />{interestedPostIds.has(post.post_id) ? "Request sent" : "Interested"}</button></footer>}
                {own && <footer>{post.status === "draft" && <><button onClick={() => beginEdit(post)}>Edit draft</button><button onClick={() => deleteDraft(post)} disabled={attached.length > 0}><Trash2 size={15} /> Delete empty draft</button><button onClick={() => changeStatus(post, "published")}>Publish</button></>}{post.status === "published" && <button onClick={() => changeStatus(post, "archived")}><Archive size={15} /> Archive</button>}</footer>}
              </article>
            );
          })}
        </section>
      )}

      {editorOpen && <div className="posts-modal-backdrop" onClick={() => !saving && setEditorOpen(false)}><section className="posts-modal" role="dialog" aria-modal="true" aria-labelledby="posts-editor-title" onClick={event => event.stopPropagation()}>
        <button className="posts-modal-close" onClick={() => !saving && setEditorOpen(false)} aria-label="Close"><X size={19} /></button>
        <p>SHARE WHAT YOU KNOW</p><h2 id="posts-editor-title">{editingPostId ? "Edit draft" : "Offer a Skill"}</h2>
        <form onSubmit={savePost}>
          <label>Course<input value={courseName} onChange={event => setCourseName(event.target.value)} maxLength={200} required placeholder="Course or skill area" /></label>
          <label>Post title<input value={postTitle} onChange={event => setPostTitle(event.target.value)} maxLength={200} required placeholder="Give your offer a clear title" /></label>
          <label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} rows={6} maxLength={10000} required placeholder="Describe the skill, learning goal, or course…" /></label>
          <label>Certification / course content<input value={certificationContent} onChange={event => setCertificationContent(event.target.value)} maxLength={1000} placeholder="Relevant certification or course outline" /></label>
          <label>Related links<textarea value={relatedLinks} onChange={event => setRelatedLinks(event.target.value)} rows={2} maxLength={2000} placeholder="Add course, portfolio, or resource links" /></label>
          <label className="posts-file-picker"><Upload size={18} /> Attach files<input type="file" multiple onChange={handleFiles} /><small>Any file type or size; actual upload limits may depend on your Supabase project.</small></label>
          <label className="posts-file-picker"><Upload size={18} /> Attach a video<input type="file" accept="video/*" onChange={handleFiles} /><small>Choose a video file. No app-level size limit is applied.</small></label>
          {files.length > 0 && <ul className="posts-selected-files">{files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`}>{file.name} · {file.size.toLocaleString()} bytes<button type="button" onClick={() => setFiles(current => current.filter((_, i) => i !== index))} aria-label={`Remove ${file.name}`}><X size={14} /></button></li>)}</ul>}
          {editingPostId && attachmentFor(editingPostId).length > 0 && <p className="posts-file-note">Remove current draft attachments from the post card before replacing them.</p>}
          <div className="posts-form-actions"><button name="intent" value="draft" type="submit" disabled={saving}><Save size={16} />{saving ? "Saving…" : "Save draft"}</button><button name="intent" value="publish" type="submit" disabled={saving}>{saving ? "Saving…" : "Publish post"}</button></div>
          {error && <p className="posts-error" role="alert">{error}</p>}
        </form>
      </section></div>}
      {profilePreview && <div className="posts-modal-backdrop" onClick={() => setProfilePreview(null)}><section className="posts-modal author-profile-preview" role="dialog" aria-modal="true" aria-labelledby="author-preview-title" onClick={event => event.stopPropagation()}><button className="posts-modal-close" onClick={() => setProfilePreview(null)} aria-label="Close"><X size={19} /></button><span className="author-preview-avatar"><UserRound size={30} /></span><p>COMMUNITY PROFILE</p><h2 id="author-preview-title">{profilePreview.name}</h2><div className="author-preview-tags"><span>{profilePreview.role}</span><span>Requests</span></div><p>{profilePreview.institution}</p></section></div>}
    </section>
  );
}

export default DiscoverPosts;
