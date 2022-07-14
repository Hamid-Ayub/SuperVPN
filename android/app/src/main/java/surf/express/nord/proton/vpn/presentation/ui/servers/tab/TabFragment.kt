package surf.express.nord.proton.vpn.presentation.ui.servers.tab

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.FragmentTabBinding
import surf.express.nord.proton.vpn.domain.model.Status
import surf.express.nord.proton.vpn.presentation.base.BaseFragment
import surf.express.nord.proton.vpn.presentation.ui.ShareViewModel
import surf.express.nord.proton.vpn.presentation.ui.servers.ServersUIDelegate
import surf.express.nord.proton.vpn.presentation.ui.servers.ServersViewModel
import surf.express.nord.proton.vpn.presentation.utils.FragmentUtils
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class TabFragment : BaseFragment<FragmentTabBinding>(R.layout.fragment_tab) {

    companion object {
        private const val EXTRA_SCREEN = "EXTRA_SCREEN"
        const val ALL_LOCATION = "ALL_LOCATION"
        const val RECOMMENDED = "RECOMMENDED"

        fun newInstance(tab: String): TabFragment {
            val bundle = Bundle()
                .apply {
                    putString(EXTRA_SCREEN, tab)
                }

            return TabFragment()
                .apply {
                    arguments = bundle
                }
        }
    }

    private val shareViewModel: ShareViewModel by activityViewModels()
    private val viewModel: ServersViewModel by activityViewModels()

    private var tabAdapter: TabAdapter? = null

    private val screen: String by lazy {
        return@lazy arguments?.getString(EXTRA_SCREEN) ?: ALL_LOCATION
    }

    override fun initBinding(view: View): FragmentTabBinding {
        return FragmentTabBinding.bind(view)
    }

    override fun initView() {
        tabAdapter = TabAdapter { server ->
            FragmentUtils.getParent(this, ServersUIDelegate::class.java)
                ?.handleServerClicked(server)
        }

        binding.recyclerView
            .apply {
                adapter = tabAdapter
            }
    }

    override fun initObserve() {
        shareViewModel.serverLiveData.observe(viewLifecycleOwner) {
            tabAdapter?.notifyDataSetChanged()
        }

        viewModel.getServers().observe(viewLifecycleOwner) {
            when (it.status) {
                Status.SUCCESS -> {
                    tabAdapter?.servers = it.data?.filter { server ->
                        if (screen == RECOMMENDED) {
                            return@filter server.recommend == true
                        }
                        return@filter true
                    } ?: listOf()
                }
                else -> {

                }
            }
        }
    }
}