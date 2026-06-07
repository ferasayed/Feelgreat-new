import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageCircle, TrendingUp, AlertTriangle, ArrowLeft, ShieldAlert, Star, CheckCircle, FlaskConical, Trophy, Clock, Mail } from "lucide-react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">You need to log in as an admin to access the dashboard.</p>
            <a href={getLoginUrl()}>
              <Button className="w-full">Login</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Admin Only</h2>
            <p className="text-muted-foreground mb-6">This dashboard is restricted to administrators only.</p>
            <a href="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <DashboardContent />;
}

function ScheduleButton() {
  const setupSchedule = trpc.schedule.setup.useMutation({
    onSuccess: () => {
      toast.success("Follow-up schedule activated!");
    },
    onError: (err) => {
      if (err.message.includes("409") || err.message.includes("CONFLICT")) {
        toast.info("Follow-up schedule is already active.");
      } else {
        toast.error("Failed to activate: " + err.message);
      }
    },
  });

  return (
    <Button
      onClick={() => setupSchedule.mutate()}
      disabled={setupSchedule.isPending}
      size="sm"
      className="shrink-0"
    >
      {setupSchedule.isPending ? "Activating..." : "Activate"}
    </Button>
  );
}

function DashboardContent() {
  const { data: stats, isLoading: statsLoading, error: statsError } = trpc.dashboard.stats.useQuery();
  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = trpc.leads.list.useQuery();
  const { data: conversations, isLoading: convsLoading, error: convsError } = trpc.dashboard.conversations.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to site</span>
            </a>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-lg font-bold">Partner Dashboard</h1>
          </div>
          <Badge variant="outline" className="text-primary border-primary">Admin</Badge>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-3xl font-bold">{statsLoading ? "..." : stats?.totalLeads ?? 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Conversations</p>
                  <p className="text-3xl font-bold">{statsLoading ? "..." : stats?.totalConversations ?? 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Interest</p>
                  <p className="text-3xl font-bold text-green-600">{statsLoading ? "..." : stats?.highInterestConversations ?? 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medium Interest</p>
                  <p className="text-3xl font-bold text-amber-600">{statsLoading ? "..." : stats?.mediumInterestConversations ?? 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error state */}
        {(statsError || leadsError || convsError) && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-sm text-red-700">
                Error loading data. Please ensure you have admin access. {statsError?.message || leadsError?.message || convsError?.message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        {/* Follow-Up Automation Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">🔄 Auto Follow-Up System</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically follows up with pending leads daily at 9:00 AM UTC. Sends personalized reminders and notifies you of results.
                </p>
              </div>
              <ScheduleButton />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Registered Leads</TabsTrigger>
            <TabsTrigger value="conversations">Chat Conversations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Partners ({leadsData?.total ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : !leadsData?.leads?.length ? (
                  <p className="text-center py-8 text-muted-foreground">No leads registered yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Follow-Up</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leadsData.leads.map(lead => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.fullName}</TableCell>
                            <TableCell>{lead.email}</TableCell>
                            <TableCell>{lead.phone}</TableCell>
                            <TableCell>{lead.country}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{lead.source}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={lead.followUpStatus === "converted" ? "default" : lead.followUpStatus === "contacted" ? "secondary" : lead.followUpStatus === "lost" ? "destructive" : "outline"}
                                className={lead.followUpStatus === "converted" ? "bg-green-100 text-green-700" : ""}
                              >
                                {lead.followUpStatus ?? "pending"}
                                {lead.followUpCount > 0 && ` (#${lead.followUpCount})`}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {convsLoading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : !conversations?.length ? (
                  <p className="text-center py-8 text-muted-foreground">No conversations yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Visitor ID</TableHead>
                          <TableHead>Messages</TableHead>
                          <TableHead>Interest Level</TableHead>
                          <TableHead>High Interest</TableHead>
                          <TableHead>Owner Notified</TableHead>
                          <TableHead>Last Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conversations.map(conv => (
                          <TableRow key={conv.id}>
                            <TableCell className="font-mono text-xs">{conv.visitorId.slice(0, 16)}...</TableCell>
                            <TableCell>{conv.messageCount}</TableCell>
                            <TableCell>
                              <Badge className={
                                conv.interestLevel === "high" ? "bg-green-100 text-green-700" :
                                conv.interestLevel === "medium" ? "bg-amber-100 text-amber-700" :
                                "bg-gray-100 text-gray-700"
                              }>
                                {conv.interestLevel}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {conv.isHighInterest ? (
                                <Badge className="bg-green-100 text-green-700">Yes</Badge>
                              ) : (
                                <span className="text-muted-foreground">No</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {conv.ownerNotified ? (
                                <Badge className="bg-blue-100 text-blue-700">Sent</Badge>
                              ) : (
                                <span className="text-muted-foreground">Pending</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(conv.updatedAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsModeration />
          </TabsContent>

          <TabsContent value="ab-tests">
            <ABTestResults />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ABTestResults() {
  const { data: tests, isLoading } = trpc.dashboard.abTestHistory.useQuery();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading A/B tests...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5" />
          A/B Test History ({tests?.length ?? 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!tests || tests.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No A/B tests have been run yet.</p>
            <p className="text-sm text-muted-foreground mt-1">A/B tests will automatically run when you have 20+ subscribers.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div key={test.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{test.testName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={test.status === "completed" ? "default" : test.status === "failed" ? "destructive" : "secondary"}
                      className={test.status === "completed" ? "bg-green-100 text-green-700" : ""}
                    >
                      {test.status === "completed" ? "Completed" : test.status === "waiting" ? "Waiting" : test.status === "sending_winner" ? "Sending Winner" : test.status === "sending_test" ? "Testing" : "Failed"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Variant A */}
                  <div className={`rounded-md p-3 border ${test.winner === "a" ? "border-green-300 bg-green-50" : "border-border"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs font-medium">Variant A {test.winner === "a" && "🏆"}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2 line-clamp-2">{test.subjectA}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Sent: {test.groupACount}</span>
                      <span>Opens: {test.opensA}</span>
                      <span className="font-medium text-foreground">Rate: {test.openRateA}%</span>
                    </div>
                  </div>

                  {/* Variant B */}
                  <div className={`rounded-md p-3 border ${test.winner === "b" ? "border-green-300 bg-green-50" : "border-border"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs font-medium">Variant B {test.winner === "b" && "🏆"}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2 line-clamp-2">{test.subjectB}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Sent: {test.groupBCount}</span>
                      <span>Opens: {test.opensB}</span>
                      <span className="font-medium text-foreground">Rate: {test.openRateB}%</span>
                    </div>
                  </div>
                </div>

                {test.status === "completed" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
                    <Trophy className="w-3 h-3 text-amber-500" />
                    <span>Winner sent to {test.remainingCount} remaining subscribers</span>
                    {test.completedAt && (
                      <span className="ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(test.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReviewsModeration() {
  const { data: reviews, isLoading } = trpc.reviews.all.useQuery();
  const utils = trpc.useUtils();
  const approveMutation = trpc.reviews.approve.useMutation({
    onSuccess: () => {
      toast.success("Review approved and published!");
      utils.reviews.all.invalidate();
    },
  });

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Customer Reviews ({reviews?.length ?? 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!reviews || reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No reviews submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="font-medium">{review.name}</div>
                      <div className="text-xs text-muted-foreground">{review.country}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{review.title}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{review.category}</Badge></TableCell>
                    <TableCell>
                      {review.isPublished ? (
                        <Badge className="bg-green-100 text-green-700">Published</Badge>
                      ) : review.isApproved ? (
                        <Badge className="bg-blue-100 text-blue-700">Approved</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {!review.isPublished && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveMutation.mutate({ id: review.id })}
                          disabled={approveMutation.isPending}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
